const ErrorHandler = require('../utils/errorHandler')

module.exports = (err,req,res,next)=>{
    
    err.statusCode = err.statusCode || 500;
    
    const Env = process.env.NODE_ENV;
    if(Env === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
     
    //wrong Mongoose object ID Error
    if(err.name == 'CastError'){
        const message = `Resources not found.Invalid : ${err.path}`
        error = new ErrorHandler(message,400)
    }

    // Handling  Mongoose validation Error
    if(err.name === 'validationError'){
        const message = object.values(err.values).map(value => value.message);
        error = new ErrorHandler(message,400)
    }

    if(Env === 'PRODUCTION'){
        let error ={...err}
        err.message = err.message

        res.status(err.statusCode).json({
            success: false,
            error: err.message || 'Internal Server Error'
        })
    }

    
}