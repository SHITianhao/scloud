const CronJob = require('cron').CronJob;
const axios = require('axios');
const constants = require('./constants');

let job;

const startSyncCronJob = () => {
    const mongoose = require('mongoose');
    const UploadFile = mongoose.model('File');
    const { sync } = require('./sync');
    console.log('Cron Sync Job Start')
    job = new CronJob('*/20 * * * * *', async () => {
        try {
            console.log('Cron Sync Job is running')
            const unSyncedFiles = await UploadFile.find({
                completed: true, 
                synced: false, 
                synchronizing: false,
                'syncedNodeList.location': {
                    $nin: [constants.LOCATION]
                }
            });
            if(unSyncedFiles.length == 0) {
                console.log(`All file synced at ${new Date().toLocaleString()}`);
                return;
            }

            unSyncedFiles.forEach(async (file) => {
                console.log(`try to sync file ${file._id} ${file.fileName}`);
                try {
                    await sync(file._id)
                } catch (error) {
                    console.error(`Sync error: ${error}`)
                }
                
            })
        } catch (err) {
            console.error(err);
        }
    }, 
    null, 
    true, 
    'America/Los_Angeles');
    
}

module.exports = {
    startSyncCronJob
}

