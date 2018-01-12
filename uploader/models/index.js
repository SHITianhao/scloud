const mongoose = require('mongoose');
// set up own promise
mongoose.Promise = Promise;

const connect = async (uri) => {
    try {
        await mongoose.connect(uri, { useMongoClient: true });
        console.info(`Mongoose connected`);
        // load models
        require('./files');
        require('./users');
    } catch (err) {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(1);
    }
};

module.exports = {
    connect
}
  