// Checks if user is authenticated or not
const catchAsyncErrors = require('./CatchingAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.isAuthenticated = catchAsyncErrors( async (req, res, next) => {
    const { token }  = req.cookies;
    if(!token){
        return next(new ErrorHandler('LogIn first to access this resource.', 401))
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);

    next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.username}, you are not allowed to access this resource.`,
            403));
        }
        next()
    }
}