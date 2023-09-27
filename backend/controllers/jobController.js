const Job = require('../models/job');
const APIFeatures = require('../utils/apiFeature');
const ErrorHandler = require('../middleware/error');
const catchAsyncErrors = require('../middleware/CatchingAsyncErrors');

exports.newJob = catchAsyncErrors( async(req, res, next) => {
    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Job post have created.',
        job
    })
} )

exports.deleteJob = catchAsyncErrors( async(req, res, next) => {
    const apiFeature = new APIFeatures(Job, req.query).delete();
    const job = await apiFeature.query;

    if (Object.keys(job).length === 0) {
        return next(new ErrorHandler('This job had been recruited!', 404));
    }

    res.status(200).json({
        success: true,
        message: 'This job is no more available.',
        job
    })
})

exports.editJob = catchAsyncErrors( async(req, res, next)=>{
    const apiFeature = new APIFeatures(Job, req.body).update();
    const job = await apiFeature.query;

    if (Object.keys(job).length === 0) {
        return next(new ErrorHandler('This job had been recruited!', 404));
    }

    res.status(200).json({
        success: true,
        message: 'This job is updated.',
        job
    })
})

exports.getJob = catchAsyncErrors( async(req, res, next)=>{
    console.log(req.query);
    const apiFeature = new APIFeatures(Job, req.query).search();
    const job = await apiFeature.query;

    if(Object.keys(job).length === 0){
        return next(new ErrorHandler('That Job is not available anymore.'));
    }

    res.status(200).json({
        success: true,
        message: 'Job found.',
        job
    })
})