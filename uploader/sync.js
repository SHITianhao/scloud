const fs = require('fs');
const path = require('path');const mongoose = require('mongoose');
const UploadFile = mongoose.model('File');
const request = require('request');
const constants = require('./constants');
const { mergeFiles, creatFolder, deleteFolder } = require('./utils');

let syncAddress;
if(constants.LOCATION === 'CHINA') {
    syncAddress = constants.US_IP;
} else {
    syncAddress = constants.CHINA_IP;
}

const writeAndSaveChunk = (readStream, writeStream) => {
    return new Promise((resolve, reject) => {
        writeStream.on('close' , () => {
            console.log('chunk file closed')
            resolve();
        })
        writeStream.on('error' , () => {
            console.log('chunk file on error')
            reject();
        })
        readStream.pipe(writeStream);
    })
}


const syncOnChunk = async (uploadFolderPath, file, chunkIndex) => {
    const chunkFilePath = path.join(uploadFolderPath, `${chunkIndex}`);
    const chunkFileWriteStream = fs.createWriteStream(chunkFilePath);
    const req = request.get(`${syncAddress}/api/v1/sync/${file.md5}/${chunkIndex}`);
    await writeAndSaveChunk(req, chunkFileWriteStream);
    req.end();
}

const addFile = async (uploadFile) => {
    const uploadFolderPath = path.join(constants.UPLOAD_TEMP_FOLDER, uploadFile.md5);
    const created = await creatFolder(uploadFolderPath);

    let syncSuccess = true;
    for(let chunkIndex = 0; chunkIndex < uploadFile.chunks.length; chunkIndex++) {
        try {
            await syncOnChunk(uploadFolderPath, uploadFile, chunkIndex);
            uploadFile.chunks[chunkIndex].synced = true;
        } catch (err) {
            console.error(err);
            syncSuccess = false;
        }
    }

    if(syncSuccess) {
        await mergeFiles(uploadFolderPath, constants.COMBINED_FILE_FOLDER, uploadFile.uploader.toString(), uploadFile.fileName, uploadFile.size);
        uploadFile.synced = true;
    }
    uploadFile.synchronizing = false;
    await uploadFile.save();
}

const deleteFile = async (file) => {
    await deleteFolder(path.join(constants.COMBINED_FILE_FOLDER, file.uploader.toString(), file.fileName));
    await deleteFolder(path.join(constants.UPLOAD_TEMP_FOLDER, file.md5));
    await UploadFile.findByIdAndRemove(file._id);
}

const sync = async (fileId) => {
    let uploadFile = await UploadFile.findById(fileId);
    if(uploadFile.synchronizing) {
        return;
    } else {
        uploadFile.synchronizing = true;
        await uploadFile.save();
    }

    if(uploadFile.syncAction === 'ADD') {
        await addFile(uploadFile);
    } else if (uploadFile.syncAction === 'DELETE') {
        await deleteFile(uploadFile);
    }
}

module.exports = {
    sync
}