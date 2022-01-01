
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema({
    name: {
        type: String,
        require: [true, 'username not find'],
        trim: true
    },
    email: {
        type: String,
        require: [true, 'email not find'],
        unique: [true, 'username trùng'],
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'lead-guide', 'guide', 'admin'],
        default: 'user'
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: Number,
        require: [true, 'password not find'],
        minlength: 8,
        select: true
    },
    comfirmPassword: {
        type: Number,
        require: [true, 'xác thực mật khẩu chưa có'],
        // validate: {
        //     validator: function (val) {
        //         return val === this.password;
        //     },
        //     message: 'xác nhận mật khẩu fail'
        // }
        select: false
    },
    passwordChangedAt: { type: Date },
    resetpassword: { type: String },
    passwordDuration: { type: Date },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})
users.methods.changedPasswordAfter = function (JWTstart) {
    const passwordtime = parseInt(this.passwordChangedAt.getTime()) / 1000
    if (this.passwordChangedAt) {
        return JWTstart < passwordtime;// phát mã //mật khẩu đã đc thay đổi
    }
    return false;
}
users.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next()
})
//method đặt lại mk
users.methods.createResetPasswords = function () {
    const resetoken = crypto.randomBytes(30).toString('hex');
    this.resetpassword = crypto
        .createHash('sha256')
        .update(resetoken)
        .digest('hex');
    this.passwordDuration = Date.now() + 10 * 60 * 1000;
    return resetoken;
}
module.exports = mongoose.model('users', users)