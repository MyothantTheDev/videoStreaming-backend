const fs = require('fs');
const path = require('path');
const minioClient = require('../config/minioclient');

const pathDir = path.join(path.dirname(__dirname),'upload');

exports.createPath = (dirname) => {
    const targetFolder = path.join(pathDir, dirname);
    fs.mkdirSync(targetFolder, { recursive: true}, err => {
        if(err) console.log(err);
    })
}

exports.isdir = (dirname) => {
    const dir = path.join(pathDir, dirname);
    return fs.existsSync(dir);
}

exports.getFolder = (dirname) => {
    return path.join(pathDir, dirname);
}

exports.assembleAndSaveFile = async (fileId, totalChunks, title) => {
    const assembleFilePath = path.join(pathDir, fileId, title);
    const chunkBuffers = [];

    for (let index = 0; index < totalChunks; index++) {
        const chunkPath = path.join(pathDir, fileId, `${index}`);
        const chunkContent = fs.readFileSync(chunkPath);
        chunkBuffers.push(chunkContent);
    }

    const assembleContent = Buffer.concat(chunkBuffers);
    fs.writeFileSync(assembleFilePath, assembleContent);

    for (let index = 0; index < totalChunks; index++) {
        const chunkPath = path.join(pathDir, fileId, `${index}`);
        fs.unlinkSync(chunkPath);
    }

    return assembleFilePath;
}