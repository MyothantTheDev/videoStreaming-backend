const Batch = require('../models/batch');
const minioClient = require('../config/minioclient');

async function minioObjectDelete(object) {
    let backet = await Batch.findById(object.batchId._id);
    await minioClient.removeObject(backet.name, object.title);
}

module.exports = minioObjectDelete;