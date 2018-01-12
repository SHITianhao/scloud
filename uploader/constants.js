const pkg = require('./package.json');
/**
 * IP
 */
const US_IP = pkg.servers.US;
const CHINA_IP = pkg.servers.CHINA;
const LOCATION = process.env.LOCATION || 'US'; // us or china, us as default
const PORT = process.env.PORT || 8081
/**
 * Paths
 */
const path = require('path');
const ROOT_PATH = __dirname;
const ROOT_FILE_FOLDER = path.join(ROOT_PATH, 'nodeServer');
const FORM_TEMP_FOLDER = path.join(ROOT_FILE_FOLDER, 'tmp');
const UPLOAD_TEMP_FOLDER = path.join(ROOT_FILE_FOLDER, 'uploads');
const COMBINED_FILE_FOLDER = path.join(ROOT_FILE_FOLDER, 'combined');

const FILE_CHUNK_SIZE = 1024 * 1024 * 20; // 20MB

const MONGODB_URL = pkg.config.mongodb;

module.exports = {
    pkg,
    FORM_TEMP_FOLDER,
    UPLOAD_TEMP_FOLDER,
    ROOT_PATH,
    ROOT_FILE_FOLDER,
    COMBINED_FILE_FOLDER,
    US_IP,
    CHINA_IP,
    LOCATION,
    PORT,
    FILE_CHUNK_SIZE,
    MONGODB_URL
}