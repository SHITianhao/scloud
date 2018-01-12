const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const constants = require('./constants');

const formidable = require('formidable');
const form = new formidable.IncomingForm({
    uploadDir: constants.UPLOAD_TEMP_FOLDER
});

// 列出文件夹下所有文件
const listDir = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, list) => {
            if(err) return reject(err);
            // 把mac系统下的临时文件去掉
            if(typeof list === 'undefined') {
                return resolve([]);
            };
            list = list.filter((file) => {
                return !file.startsWith(".");
            }).sort((a, b) => {
                const valueA = parseInt(a);
                const valueB = parseInt(b);
                return valueA - valueB;
            });
            resolve(list);
        });
    })
}
// 合并文件
const mergeFiles = async (srcDir, targetDir, userId, newFileName, size) => {
    const userFolderPath = path.join(targetDir, userId);
    await creatFolder(userFolderPath);
    const newFilePath = path.join(userFolderPath, newFileName);
    const targetStream = fs.createWriteStream(newFilePath);
    const fileArr = await listDir(srcDir);
    console.log(fileArr);
    // 把文件名加上文件夹的前缀
    const combineFiles = fileArr.map((file) => {
        return srcDir + '/' + file;
    });
    await concatFiles(combineFiles, newFilePath)
    console.log('Merge Success to '+newFilePath);
}

// 删除文件
const deleteFolder = async (path) => {
    return new Promise((resolve, reject) => {
        rimraf(path, () => {
            resolve();
        });
    })
}

// 获取文件Chunk列表
const getChunkList = async (filePath, folderPath) => {
    const isFileExit = await isExist(filePath);
    // 如果文件(文件名, 如:node-v7.7.4.pkg)已在存在, 不用再继续上传, 真接秒传
    if (isFileExit) {
        return {
            stat: 1,
            file: {
                isExist: true,
                name: filePath
            },
            desc: 'file is exist'
        };
    } else {
        let isFolderExist = await isExist(folderPath);
        // 如果文件夹(md5值后的文件)存在, 就获取已经上传的块
        let fileList = [];
        if (isFolderExist) {
            fileList = await listDir(folderPath);
        }
        return {
            stat: 1,
            chunkList: fileList,
            desc: 'folder list'
        }
    }
}

// 文件或文件夹是否存在
const isExist = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.exists(filePath, exists => {
            resolve(exists);
        });
    })
}

// 文件夹是否存在, 不存在则创建文件
const creatFolder = async (folderPath) => {
    const exist = await isExist(folderPath);
    return new Promise((resolve, reject) => {
        if(!exist) fs.mkdir(folderPath, err => {
            if(err) return reject(err);
            resolve(true);
        });
        else resolve(false);
    })
}
// 把文件从一个目录移动到别一个目录
const moveFile = async (src, dest) => {
    return new Promise((resolve, reject) => {
        fs.rename(src, dest, err => {
            if(err) return reject(err);
            resolve('copy file:' + dest + ' success!')
        });
    });
}

const promifyFormParse = (req, form) => {
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, file) => {
            if(err) return reject(err);
            resolve({ fields, file })
        })
    })
}

const concatFiles = (files, destFile) => {
    return new Promise((resolve, reject) => {
        let index = 0;
        const next = () => {
            const file = files[index];
            const writeStream = fs.createWriteStream(destFile, {flags: 'a'});
            const readStream = fs.createReadStream(file);
            readStream.on("close", () => {
                console.log(index+' read file closed');
                index++;
                if(index >= files.length) {
                    writeStream.close();
                    resolve();
                }
                else {
                    next();
                }
            }).pipe(writeStream);
        }
        next();
    })
}

module.exports = {
    isExist,
    getChunkList,
    mergeFiles,
    listDir,
    moveFile,
    creatFolder,
    deleteFolder,
    promifyFormParse
}