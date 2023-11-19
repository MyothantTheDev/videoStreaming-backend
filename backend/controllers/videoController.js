const mongoose = require('mongoose');
const Video = require('../models/video');
const Batch = require('../models/batch');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/CatchingAsyncErrors');
const APIFeatures = require('../utils/apiFeature');
const minioClient = require('../config/minioclient');
const fs = require('fs');
const minioObjectDelete = require('../utils/minioUtils');
const { isdir,createPath,getFolder,assembleAndSaveFile } = require('../utils/File');
const path = require('path');


exports.newVideo = catchAsyncErrors ( async (req, res, next) => {

    //Check file path and create file path

   try {
       const { index, title } = req.body;
       const files = req.files;

        if (!isdir(title)) {
            createPath(title);
        }
        const targetPath = getFolder(title);
        const targetFile = path.join(targetPath, `${index}`);

        const chunkFile = fs.createWriteStream(targetFile, {flags: 'w'});
        chunkFile.write(files[0].buffer);
        chunkFile.end();

    } catch (error) {
        console.log(error);
    }
    
    res.status(200).json({
        success: true,
        message: "Chunk received successfully!",
    })
})

exports.combineVideo = catchAsyncErrors( async (req, res, next) => {

    const { fileId, totalChunks, batchId, title } = req.body;
    
    try {

        const batch = await Batch.findById(batchId);
        const videoList = [];
        for (let index = 0; index < fileId.length; index++) {
            let video;
            let fileSize;
            assembleAndSaveFile(fileId[index],totalChunks[index],fileId[index])
            .then(file => {
                const combineFile = fs.statSync(file);
                fileSize = combineFile.size;
                return file
            })
            .then( fileLink => {
                // const file = fs.readFileSync(fileLink);
                minioClient.fPutObject(batch.name, title[index], fileLink)
                .then( async () => {
                    video = new Video({
                        filesize: fileSize,
                        batchId: batchId,
                        title: title[index]
                    })

                    video.save().then( () => {
                        const targetDir = getFolder(fileId[index]);
                        fs.unlinkSync(fileLink);
                        fs.rmdirSync(targetDir);
                    })

                    videoList.push(video)
                })
                .catch(err => console.error('Error: ',err))
            })
        }

        res.status(200).json({
            success: true,
            message: 'Files Combine and Uploaded',
            video: videoList
        })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Something Wrong'
        })
    }
})

exports.getVideo = catchAsyncErrors ( async (req, res, next) => {
    const apiFeature = new APIFeatures(Video, req.query).search();
    const video = await apiFeature.query.populate('batchId');

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
    const request = req.query && req.body;
    const apiFeature = new APIFeatures(Video, request).delete();
    const video = await Promise.all(apiFeature.query);
    
    if (Array.isArray(video)) {
        video.forEach( async (vid) => await minioObjectDelete(vid) );
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

exports.streamVideo = catchAsyncErrors ( async (req, res, next) => {
    const apiFeature = new APIFeatures(Video, req.query).search();
    const video = await apiFeature.query.populate('batchId');
    const bucket = video[0].batchId.name;

    res.setHeader('Content-Type', 'binary/octet-stream');
    res.setHeader('Accept-Ranges', 'bytes');

    res.status(200).set({
        'Content-Length': video[0].filesize
    })

    const streamData = await minioClient.getObject(bucket, video[0].title);

    streamData.pipe(res);
    streamData.on('end', () => console.log('File streaming complete.'))
    streamData.on('error', (err) => console.error('Error: ', err) )
})