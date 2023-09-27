const bcrypt = require('bcrypt');

const hashPassword = async (plainText) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainText, salt);
}

module.exports = hashPassword;