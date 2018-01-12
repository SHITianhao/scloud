const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const UploadFile = mongoose.model('File');
const User = mongoose.model('User');

const bodyParser = require('body-parser');

const { evaluate } = require('../jwt')
const constants = require('../constants');
const { deleteFolder } = require('../utils');
/**
 * 获取用户文件列表
 */
router.get('/', evaluate, async (req, res, next) => {
    const userRole = req.user.role;
    let userId;
    if(userRole === 'Client') {
        userId = req.user._id;
    } else if (userRole === 'Support' || userRole === 'Root') {
        userId = req.query.userId;
    } else {
        next(new Error('权限异常'));
    }
    const files = await UploadFile.find({ uploader: userId, deleted: false })
        .select({"chunks": 0})
        .sort({'uploadedAt':  -1});
    res.json({
        files
    })
})


/**
 * 下载文件
 */
router.get('/:fileId', evaluate, async (req, res, next) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const { fileId } = req.params;
        let file;
        if(userRole === 'Client') {
            file = await UploadFile.findOne({ uploader: userId, _id: fileId });
        } else if (userRole === 'Support' || userRole === 'Root') {
            file = await UploadFile.findById({ _id: fileId });
        } else {
            next(new Error("账户异常"));
        }
        if(file === null) return next(new Error("无此文件"));
        fs
        res.sendFile(path.join(constants.COMBINED_FILE_FOLDER, file.uploader.toString(), file.fileName));
    } catch (error) {
        next(error)
    }
})

/**
 * 删除文件
 */
router.delete('/:fileId', evaluate, async (req, res, next) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const { fileId } = req.params;
        let file;
        if(userRole === 'Client') {
            file = await UploadFile.findOne({ uploader: userId, _id: fileId });
        } else if (userRole === 'Support' || userRole === 'Root') {
            file = await UploadFile.findById({ _id: fileId });
        } else {
            next(new Error("账户异常"));
        }
        if(file === null) return next(new Error("无此文件"));
        await deleteFolder(path.join(constants.COMBINED_FILE_FOLDER, file.uploader.toString(), file.fileName));
        await deleteFolder(path.join(constants.UPLOAD_TEMP_FOLDER, file.md5));
        await UploadFile.findByIdAndUpdate(file._id, 
            { 
                deleted: true, 
                syncAction: 'DELETE',
                synced: false, 
                syncedNodeList: [{location: constants.LOCATION, syncedAt: Date.now()}]
            }
        );
        res.json({
            fileId: file._id
        })
    } catch (error) {
        next(error)
    }
})



module.exports = router;