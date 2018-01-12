const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const UploadFile = mongoose.model('File');
const bodyParser = require('body-parser');

const constants = require('../constants');

const { promifyFormParse, creatFolder, moveFile, deleteFolder, mergeFiles } = require('../utils');
const { evaluate } = require('../jwt')

const formidable = require('formidable');
/**
 * 上传新文件
 */
router.post('/start', bodyParser.json(), evaluate, async (req, res, next) => {
    try {
        const { fileName, md5, chunkSize, size } = req.body;
        let uploadFile = await UploadFile.findOne({ fileName, md5 });
        if(uploadFile === null) {
            uploadFile = new UploadFile({
                fileName,
                completed: false,
                uploadedAt: Date.now(),
                uploader: req.user._id,
                synced: false,
                md5,
                chunkSize,
                chunks: [],
                size
            });
            await uploadFile.save();
        }
        const uploadTempFolder = path.join(constants.UPLOAD_TEMP_FOLDER, md5);
        const created = await creatFolder(uploadTempFolder);
        res.json({
            fileId: uploadFile._id,
            completed: uploadFile.completed,
            synced: uploadFile.synced,
            chunks: uploadFile.chunks
        })
    } catch (err) {
        next(err);
    }
})

/**
 * 上传chunk
 */
router.post('/chunk', evaluate, async (req, res, next) => {
    const form = new formidable.IncomingForm({
        uploadDir: constants.FORM_TEMP_FOLDER,
        maxFieldsSize: constants.FILE_CHUNK_SIZE,
        hash: 'md5'
    })
    try {
        const { fields, file } = await promifyFormParse(req, form);
        const { fileId, chunkIndex, md5 } = fields;
        if(md5 !== file.data.hash) {
            throw new Error('MD5 不匹配');
        }
        let uploadFile = await UploadFile.findById(fileId);
        const destFile = path.join(constants.UPLOAD_TEMP_FOLDER, uploadFile.md5, chunkIndex);
        await moveFile(file.data.path, destFile);
        // 更新数据库
       
        uploadFile.chunks.push({
            synced: false,
            index: chunkIndex,
            md5: md5,
            completed: true
        })
        await uploadFile.save();
        res.json({
            fileId,
            chunkIndex
        })
    } catch (err) {
        next(err);
    }
})

/**
 * 文件上传结束
 */
router.post('/end', bodyParser.json(), evaluate, async (req, res, next) => {
    try {
        const { fileId } = req.body;
        let uploadFile = await UploadFile.findById(fileId);
        const chunks = path.join(constants.UPLOAD_TEMP_FOLDER, uploadFile.md5);
        await mergeFiles(chunks, constants.COMBINED_FILE_FOLDER, uploadFile.uploader.toString(), uploadFile.fileName, uploadFile.size);
    
        uploadFile = Object.assign(
            uploadFile, 
            { 
                completed: true, 
                uploadedAt: Date.now(), 
                syncedNodeList: [{
                    location: constants.LOCATION,
                    syncedAt: Date.now()
                }]
            }
        );
        
        await uploadFile.save();
        res.json({
            fileId: uploadFile._id,
            completed: uploadFile.completed,
            synced: uploadFile.synced,
            chunks: uploadFile.chunks
        });
    } catch (err) {
        next(err)
    }
});

module.exports = router;