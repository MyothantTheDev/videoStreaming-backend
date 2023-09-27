const multer = require('multer');
const path = require('path');
const Batch = require('../models/batch');
const Video = require('../models/video');
const { isdir,createPath,getFolder } = require('../utils/File');

const Storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = getFolder();
        if(isdir()) {
            createPath();
        }
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

module.exports = Storage;