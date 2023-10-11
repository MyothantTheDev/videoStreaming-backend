const User = require('../models/users');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/CatchingAsyncErrors');
const sendToken = require('../utils/jwtToken');


//Login User => /api/v1/login

exports.loginUser = catchAsyncErrors ( async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    //Finding user in database
    const user = await User.findOne({ email }).select('+password');

    if (!user._id){
        return next(new ErrorHandler('Invaild Email or Password', 401));
    }
    const isPasswordMatched =  await user.comparePassword(password);

    if (!isPasswordMatched){
        return next(new ErrorHandler('Invaild Email or Password', 401));
    }

    sendToken(user, 200, res)

})

// Get currently logged in user => /api/v1/me

exports.getUser = catchAsyncErrors ( async ( req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

// LogOut => /api/v1/logout

exports.logoutUser = catchAsyncErrors ( async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})