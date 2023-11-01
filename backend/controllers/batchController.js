const Batch = require('../models/batch');
const minioClient = require('../config/minioclient');
const ErrorHandler = require('../utils/errorHandler');

exports.newBatch = async (req, res, next) => {
    const exist = await Batch.findOne({name: req.body.name});
    if(exist) {
        return next(new ErrorHandler("Batch is already created. Try another one!", 406));
    }
    const batch = await Batch.create(req.body);
    const batchName = batch.name.toString();
    //create bucket in minio
    minioClient.makeBucket(batchName, 'us-east-1', error => {
        if(error) return console.log(error);
    });

    res.status(201).json({
        success: true,
        batch,
        message: `${batchName} is created.`
    })
}

exports.getBatch = async (req, res, next) => {
    const batch = await Batch.find({});
    res.status(200).json({
        success: true,
        batch,
        count: batch.length
    })
}