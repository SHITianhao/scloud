const path = require('path');
const { saveChunk } = require('./storage');
const testfile = path.join(__dirname, 'test.txt');
console.log(testfile);
saveChunk('test', 1, testfile);