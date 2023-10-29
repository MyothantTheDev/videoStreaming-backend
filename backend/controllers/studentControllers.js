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
    let student = await User.create(req.body);
    delete student.password;
    
    res.status(200).json({
        success: true,
        message : `${student.username}'s account is created!`,
        student
    })
})

exports.getStudents = catchAsyncErrors (async (req, res, next) => {
    
    const apiFeature = new APIFeatures(User, req.query).search(true);
    const student = await apiFeature.query.populate('batchId').select('-password');
 
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
        count: student.length,
        student
    })
})