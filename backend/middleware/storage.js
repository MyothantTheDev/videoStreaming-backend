const Storage = require('../config/storage');
const multer = require('multer');

const upload = multer({ storage: Storage});

module.exports = upload;