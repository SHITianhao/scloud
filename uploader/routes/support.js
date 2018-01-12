const path = require('path');
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

const constants = require('../constants');

router.get('/clients', async (req, res) => {
    const clients = await User.find({role: 'Client'}).select({"password": 0});
    res.json({
        clients
    });
});


module.exports = router;