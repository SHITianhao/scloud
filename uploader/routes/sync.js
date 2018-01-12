const path = require('path');
const express = require('express');
const router = express.Router();

const constants = require('../constants');

/**
 * 同步chunk
 */
router.get('/:md5/:chunkIndex', async (req, res) => {
    const { md5, chunkIndex } = req.params;
    res.sendFile(path.join(constants.UPLOAD_TEMP_FOLDER, md5, chunkIndex));
});


module.exports = router;