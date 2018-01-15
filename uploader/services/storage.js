const path = require('path');
const oss = require('ali-oss');
const { createFolder, moveFile } = require('../utils');
const { OBJECT_STORAGE_CONFIG, DATA_FOLDER } = require('../constants');
const useObjectStorage = OBJECT_STORAGE_CONFIG !== undefined && OBJECT_STORAGE_CONFIG !== {};
let store = null;

if(useObjectStorage) {
    store = oss({
        accessKeyId: OBJECT_STORAGE_CONFIG.accessKeyID,
        accessKeySecret: OBJECT_STORAGE_CONFIG.accessKeySecret,
        bucket: OBJECT_STORAGE_CONFIG.bucket,
        region: OBJECT_STORAGE_CONFIG.region,
    });
}

const createFileOnLocalStorage = async (username, folderPath, fileName) => {
    const userFolder = path.join(DATA_FOLDER, username, folderPath);
    const filePath = path.join(userFolder, fileName);
    await createFolder(filePath);
}

const createFile = async (username, folderPath, fileName) => {
    // 对象存储中没有文件夹概念
    if (useObjectStorage) return Promise.resolve();
    await createFileOnLocalStorage(username, folderPath, fileName);
}

const saveChunkOnLocalStorage = async (filePath, chunkIndex, chunkTempFilePath) => {
    const destFile = path.join(filePath, chunkIndex);
    await moveFile(chunkTempFilePath, destFile);
}

function* generator(name, filePath) {
    yield store.put(name, filePath);
}

const saveChunkOnStorage = async (filePath, chunkIndex, chunkTempFilePath) => {
    // console.log(store)
    const object = generator(filePath + '/' + chunkIndex, chunkTempFilePath);
    console.log(object)
    var result = await store.listBuckets({
        "max-keys": 10
      });
    console.log(result);
}

const saveChunk = async (filePath, chunkIndex, chunkTempFilePath) => {
    if(useObjectStorage) {
        await saveChunkOnStorage(filePath, chunkIndex, chunkTempFilePath);
    } else {
        await saveChunkOnLocalStorage(filePath, chunkIndex, chunkTempFilePath);
    }
}


module.exports = {
    createFile,
    saveChunk
}

