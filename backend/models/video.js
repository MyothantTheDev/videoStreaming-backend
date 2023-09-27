const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String},
    filesize: { type: Number, required: true },
    batchId: {type: mongoose.Schema.Types.ObjectId, ref: 'Batch'},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;