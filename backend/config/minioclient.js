const Minio = require('minio');
// const dotenv = require('dotenv');

// dotenv.config({ path: 'backend/config/config.env' });

const minioClient = new Minio.Client({
    endPoint: 'minio.container.net',
    port: 9000,
    useSSL: false,
    accessKey: '46UcATDjkKhsOHKQi4Wy',
    secretKey: 'wH5A3PumkuFj0XD2XS6XshIdVcmPQJ8itcnjGROd'
});

module.exports = minioClient;

// minioClient.fPutObject('batch-1', '1--installation and run.mp4','/media/james/Local Disk/Laravel/1-- basic laravel/1--install laravel on window.mp4',function (error) {
//     if (error) console.log(error);
//     console.log('upload success.');
// });