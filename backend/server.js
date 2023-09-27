const app = require('./app');
const connectDB = require('./config/database');
const dotenv = require('dotenv');


// Handle Uncaught exceptions
process.on('uncaughtException',err=>{
    console.log(`ERROR : ${err.message}`);
    console.log('SHutting down due to uncaught exception');
    process.exit(1)
})

// Setting up config file
dotenv.config({ path: 'backend/config/config.env' })

//Disable TLS Rejection for self-signed certificate
//Can remove after generate ssl chained certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//Handle Unhandled Promise rejections
process.on('unhandleRejection',err=>{
    console.log(`ERROR:${err.messange}`);
    console.log('Shutting down the server due to Unhandle Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})