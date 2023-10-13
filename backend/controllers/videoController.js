const mongoose = require('mongoose');
const Video = require('../models/video');
const Batch = require('../models/batch');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/CatchingAsyncErrors');
const APIFeatures = require('../utils/apiFeature');
const minioClient = require('../config/minioclient');
const fs = require('fs');
const minioObjectDelete = require('../utils/minioUtils');


exports.newVideo = catchAsyncErrors ( async (req, res, next) => {
    const { batchId } = req.body;
    const batchIdObj = new mongoose.Types.ObjectId(batchId);
    const batch = await Batch.findById(batchId);
    const files = req.files;
    const videos = await Promise.all(
        files.map(async (file) => {
            const video = new Video({
                title: file.originalname,
                filesize: file.size,
                batchId: batchIdObj,
            });
            
            await video.save();

            //call 
            await minioClient.fPutObject(batch.name, file.originalname, file.path);
            fs.unlinkSync(file.path);
            return video;
        })
    )
    
    res.status(200).json({
        success: true,
        message: "Video upload completed!",
        videos
    })
})

exports.getVideo = catchAsyncErrors ( async (req, res, next) => {
    const apiFeature = new APIFeatures(Video, req.query).search();
    const video = await apiFeature.query;

    if(Object.keys(video).length === 0) {
        return next(new ErrorHandler('Video has been deleted or not uploaded!', 404))
    }

    res.status(200).json({
        success: true,
        message: 'Video found!',
        video
    })
})

exports.updateVideo = catchAsyncErrors ( async (req, res, next) => {
    const { batchId } = req.body;
    const file = req.file;
    var video = await Video.findById(req.body._id).populate('batchId').exec();
    await minioClient.removeObject(video.batchId.name, video.title);
    const batch = await Batch.findById(batchId);
    const updateItem = await Video.updateOne({ _id: video._id }, {
        $set: {
            title: file.originalname,
            size: file.size,
            batchId: new mongoose.Types.ObjectId(batchId)
        }
    })
    await minioClient.fPutObject(batch.name, file.originalname, file.path);
    fs.unlinkSync(file.path);
    if(Object.keys(video).length === 0) {
        return next(new ErrorHandler('Video has been deleted or not uploaded!', 404))
    }

    res.status(200).json({
        success: true,
        message: 'Video Updated!',
        updateItem
    })
})

exports.deleteVideo = catchAsyncErrors ( async (req, res, next) => {

    const apiFeature = new APIFeatures(Video, req.body).delete();
    const video = await Promise.all(apiFeature.query);
    
    if (Array.isArray(video)) {
        await video.forEach( vid => minioObjectDelete(vid) );
    } else {
        await minioObjectDelete(video);
    }

    if(Object.keys(video).length === 0){
        return next(new ErrorHandler('Video not found!', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Deleted User Successful.',
        video
    })
})

// exports.streamVideo = catchAsyncErrors ( async (req, res, next) => {
//     const file = 
    
// })