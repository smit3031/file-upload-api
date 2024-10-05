const mongoose = require('mongoose');

const uploadStatusSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    totalChunks: { type: Number, required: true },
    uploadedChunks: { type: [Number], default: [] },  
    merged: { type: Boolean, default: false },
    filePath: { type: String, default: '' }, 
});

const UploadStatus = mongoose.model('UploadStatus', uploadStatusSchema);
module.exports = UploadStatus;