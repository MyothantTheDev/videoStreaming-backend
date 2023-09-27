const mongoose = require('mongoose');
const hashPassword = require('../utils/hashpwd');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    email: { type: String, required: true, unique: true },
    role:{type: String, default: 'user'},
    firstName: { type: String },
    lastName: { type: String },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Encrypting password before saving user

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next()
    }
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
    next()
})

//Return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    });
}

//Compare User password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;