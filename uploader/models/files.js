const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    completed: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now() },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    synchronizing: { type: Boolean, default: false },
    synced: { type: Boolean, default: false },
    syncedNodeList: [{
        location: { type: String, require: true },
        syncedAt: { type: Date, default: Date.now() },
    }],
    syncAction: { type: String, enum: ["ADD", "DELETE"] },
    deleted: { type: Boolean, default: false },
    md5: { type: String, required: true, index: { unique: true } },
    chunkSize: { type: Number, required: true },
    chunks: [{
        synced: { type: Boolean, default: false },
        index: { type: Number, required: true },
        md5: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }],
    size: { type: Number, required: true },
});

module.exports = mongoose.model('File', FileSchema);