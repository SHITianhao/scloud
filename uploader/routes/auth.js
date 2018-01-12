const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

const bodyParser = require('body-parser');

const jwt = require('../jwt');
const MaxileError = require('../error');

router.post('/signup', bodyParser.json(), async (req, res, next) => {
    const { username, email, password } = req.body;
    const existUser = await User.findOne(
        {$or: [
            {email},
            {username}
        ]}
    );
    console.log(existUser)
    if(existUser !== null) return next(new Error('用户名或邮箱已存在'));

    const registUser = new User({
        username,
        email,
        password,
        role: "Client"
    });
    console.log(registUser)
    await registUser.save();
    const token = jwt.getToken({ userId: registUser._id });
    res.json({
        token
    })
});

router.post('/login',  bodyParser.json(), async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existUser = await User.findOne({ username });
        if(existUser == null) {
            throw new MaxileError({
                message: '用户名不存在',
                httpCode: 400,
                preload: {
                    message: '用户名不存在',
                }
            })
        }
        const pwdMatch = existUser.comparePassword(password);
        if(pwdMatch) {
            const token = jwt.getToken({ userId: existUser._id });
            res.json({
                token,
                role: existUser.role
            })
        } else {
            throw new MaxileError({
                message: '密码错误',
                httpCode: 400,
                preload: {
                    message: '密码错误',
                }
            })
        }
    } catch (err) {
        next(err)
    }

});

module.exports = router;