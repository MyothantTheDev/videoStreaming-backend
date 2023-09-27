const fs = require('fs');
const path = require('path');

const pathDir = path.join(path.dirname(__dirname),'upload');

exports.createPath = () => {
    fs.mkdirSync(pathDir, { recursive: true}, err => {
        if(err) console.log(err);
    })
}

exports.isdir = () => {
    return fs.existsSync(pathDir);
}

exports.getFolder = () => {
    return pathDir;
}