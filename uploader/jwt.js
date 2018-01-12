const mongoose = require('mongoose');
const User = mongoose.model('User');

const jwt = require('jsonwebtoken');
const secret = 'HDEqyMVbB32lXFoknRkp';
const defaultExpiresIn = '24h';

/**
 * 获得JWT
 * @param {*} preload 
 * @param {*} options 
 */
const getToken = (preload, options) => {
    options = options || {};
    let expiresIn = options.expiresIn || defaultExpiresIn;
    return jwt.sign(preload, secret, {expiresIn: expiresIn});
}

/**
 * 验证Token
 * @param {*} token 
 */
const verify = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) return reject(err);
            resolve(decoded);
        });
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const evaluate = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('Authorization Header Not Found');
        }
        // get the last part from a authorization header string like "bearer token-value"
        const token = req.headers.authorization.split(' ')[1];
        const { userId } = await verify(token);
        const foundUser = await User.findById(userId);
        req.user = foundUser;
        next();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getToken,
    verify,
    evaluate
}