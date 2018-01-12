const express = require('express')
const app = express();
const path = require('path');
const http = require('http');
const mongodb = require('./models');

const constants = require('./constants');
const cron = require('./cron');
const MaxileError = require('./error');

const createInitRootUser = async () => {
    const mongoose = require('mongoose');
    const User = mongoose.model('User');
    const root = await User.findOne({role: 'Root'});
    // root user exist
    if(root !== null) return;
    const initRootConfig = constants.pkg.config.root;
    const initRoot = new User({
        role: 'Root',
        username: initRootConfig.username,
        email: initRootConfig.email,
        password: initRootConfig.password,
        location: initRootConfig.location
    })
    await initRoot.save();
    console.log('init root created');
}

mongodb
    .connect(constants.MONGODB_URL)
    .then(() => {
        return createInitRootUser()
    })
    .then(() => {
        // 处理静态资源
        app.use(express.static(path.join(__dirname)))

        // 处理跨域
        app.all('*', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
            res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
            res.header('X-Powered-By', ' 3.2.1')
            if (req.method == 'OPTIONS') {
                // 让options请求快速返回
                res.send(200)
            } else {
                next()
            }
        })

        app.use('/api/v1/check', require('./routes/check'));
        app.use('/api/v1/upload', require('./routes/upload'));
        app.use('/api/v1/sync', require('./routes/sync'));
        app.use('/api/v1/auth', require('./routes/auth'));
        app.use('/api/v1/files', require('./routes/files'));
        app.use('/api/v1/server', require('./routes/server'));
        app.use('/api/v1/support', require('./routes/support'));

        app.use((err, req, res, next) => {
            console.error(err);
            if(err instanceof MaxileError) {
                res.status(err.httpCode).json(err.preload);
            } else {
                res.status(500).send('Something broke!')
            }
            
        })

        app.use('*', (req, res) => {
            res.send("welcome Maxile");
        })

        const httpServer = http.createServer(app);
        httpServer.listen(constants.PORT, ()=>{
            console.log('%s HTTP Server is running on port: %s', constants.LOCATION, constants.PORT);
        });

        cron.startSyncCronJob();
    })
    .catch(err => {
        console.error(err);
    })