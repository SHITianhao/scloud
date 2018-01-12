import { FILE_CHUNK_SIZE } from '../components/constants';
import SparkMD5 from 'spark-md5';

const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
const fileReader = new FileReader();

const readChunk = (file, chunkIndex) => {
    const fileSize = file.size;
    const start = chunkIndex * FILE_CHUNK_SIZE;
    const end = start + FILE_CHUNK_SIZE > fileSize ? fileSize : start + FILE_CHUNK_SIZE;
    const chunk = blobSlice.call(file, start, end);
    fileReader.readAsArrayBuffer(chunk);
    return { end: end >= fileSize, chunk };
}

const getUploadChunkIndex = (uploadedChunkIndexs, currentIndex, chunkSize) => {
    let chunkUploaded = uploadedChunkIndexs.includes(currentIndex);
    while(chunkUploaded && currentIndex < chunkSize) {
        console.log(currentIndex)
        chunkUploaded = uploadedChunkIndexs.includes(++currentIndex);
    }
    console.log(currentIndex)
    return currentIndex;
}


const readFileIntoChunks = (file, chunkSize, uploadedChunkIndexs, handleChunk) => {
    return new Promise((resolve, reject) => {
        let chunkIndex = getUploadChunkIndex(uploadedChunkIndexs, 0, chunkSize);
        console.log(chunkIndex)
        console.log(uploadedChunkIndexs)
        if(chunkIndex >= chunkSize) resolve(false);

        let uploadedChunk = [];
        let chunkResult = {
            end: false,
            chunk: null
        };
        const start = Date.now();

        fileReader.onload = (event) => {
            // calculat chunk MD5
            const buffer = event.target.result;
            const spark = new SparkMD5.ArrayBuffer();
            spark.append(buffer);
            const md5 = spark.end();
            
            handleChunk(chunkResult.chunk, md5, chunkIndex)
            .then(resp => {
                if(!chunkResult.end) {
                    chunkIndex = getUploadChunkIndex(uploadedChunkIndexs, ++chunkIndex, chunkSize);
                    if(chunkIndex < chunkSize) {
                        chunkResult = readChunk(file, chunkIndex);
                    } else {
                        console.log('done: '+((Date.now()-start)/1000/60)); 
                        resolve(false); 
                    }
                } else {
                    console.log('done: '+((Date.now()-start)/1000/60)); 
                    resolve(true); 
                }
            });

        }
        
        chunkResult = readChunk(file, chunkIndex);
    })
}

module.exports = {
    readFileIntoChunks
}