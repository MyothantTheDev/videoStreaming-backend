const Minio = require('minio');
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/config/config.env' });

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

module.exports = minioClient;

// minioClient.fPutObject('batch-1', '1--installation and run.mp4','/media/james/Local Disk/Laravel/1-- basic laravel/1--install laravel on window.mp4',function (error) {
//     if (error) console.log(error);
//     console.log('upload success.');
// });