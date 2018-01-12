const express = require('express');
const router = express.Router();

const constants = require('../constants');

router.get('/ip', async (req, res) => {
    res.json({
        US: `${constants.US_IP}/api/v1`,
        CHINA: `${constants.CHINA_IP}/api/v1`
    })
})

module.exports = router;