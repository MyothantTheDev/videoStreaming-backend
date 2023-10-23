const User = require('../models/users');
const APIFeatures = require('../utils/apiFeature');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/CatchingAsyncErrors');
const sendToken = require('../utils/jwtToken');

// Create new user => /api/v1/admin/student/new
exports.newStudents = catchAsyncErrors (async (req, res, next) => {
    const email = req.body.email;
    const exist = await User.findOne({ email });
    if (exist) {
        return next(new ErrorHandler("Email already in use. Try another one!", 406));
    }
    const student = await User.create(req.body);
    
    res.status(200).json({
        success: true,
        message : 'User created!',
        student
    })
})

exports.getStudents = catchAsyncErrors (async (req, res, next) => {
    
    const apiFeature = new APIFeatures(User, req.query).search(true);
    const student = await apiFeature.query.populate('batchId');
 
    if(student.length === 0) {
        return next(new ErrorHandler('User not found!', 404))
    }

    res.status(200).json({
        success: true,
        message : 'Retrieved Required User.',
        count: student.length,
        student
    })
})

exports.updateStudents = catchAsyncErrors (async (req, res, next) => {
    const apiFeature = new APIFeatures(User, req.body).update();
    const student = await apiFeature.query;

    if(Object.keys(student).length === 0){
        return next(new ErrorHandler('User not found!', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Updated User Successful.',
        student
    })
})

exports.deleteStudents = catchAsyncErrors ( async (req, res, next) => {

    const apiFeature = new APIFeatures(User, req.query).delete();
    const student = await apiFeature.query;

    if(Object.keys(student).length === 0){
        return next(new ErrorHandler('User not found!', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Deleted User Successful.',
        student
    })
})