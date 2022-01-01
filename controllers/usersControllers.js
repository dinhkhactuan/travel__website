const crypto = require('crypto');
const userModel = require('../models/users');

const jwt = require('jsonwebtoken');
const handleFactory = require('./handleFactory')
const multer = require('multer')
const sharp = require('sharp')
const Email = require('../utils/sendEmail')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/img/users')
//     },
//     filename: function (req, file, cb) {
//         const ext = file.mimetype.split('/')[1]
//         cb(null, `user-${req.user.id}.${ext}`)
//     }
// })

const multerstorage = multer.memoryStorage()
const multerfileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

const upload = multer({
    storage: multerstorage,
    fileFilter: multerfileFilter
})

exports.uploadFile = upload.single('photo')

exports.rezieImg = async (req, res, next) => {
    if (!req.file) return next()

    req.file.filename = `user-${req.user.id}.jpeg`
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`)
    next()
}

const tokens = id => {
    return jwt.sign({ id }, process.env.JWTSECRET)
}
const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKE_expires * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true
}

const createtoken = (user, status, res) => {
    const token = tokens(user._id)
    res.cookie('JWT_COOKIE', token, cookieOption)
    user.password = undefined
    user.comfirmPassword = undefined
    res.status(status).json({
        status: 'success',
        token,
        data: {
            user
        },

    })
}
exports.createUser = async (req, res, next) => {
    try {
        const user = await userModel.create({
            emailname: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
        const url = `${req.protocol}://${req.get('host')}/me`
        console.log(url)
        await new Email(user, url).sendWelcome()
        createtoken(user, 200, res)

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            err: error
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json('email|| pas ko hợp lệ')
        }
        const data = await userModel.findOne({ email }).select('+password')
        console.log(data)
        createtoken(data, 200, res)
    } catch (err) {
        res.json({
            message: 'login fail'
        })
    }
}
exports.authentication = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies.JWT_COOKIE) {
            token = req.cookies.JWT_COOKIE
        }
        if (!token) {
            console.log(token)
            return res.json('token not a find')
        }
        //giải mã
        const tokens = jwt.verify(token, process.env.JWTSECRET);
        //check user có tồn tại hay ko
        const usersdata = await userModel.findById(tokens.id)
        if (!usersdata) {
            return res.json({
                message: 'usersdata fail'
            })
        }
        //thay đổi mk
        // if (usersdata.changedPasswordAfter(tokens.iat)) {
        //     return res.json({
        //         message: 'password was changed'
        //     })
        // }
        req.user = usersdata;
        next()
    }
    catch (err) {
        res.status(500).json({
            message: err
        })
    }

}

exports.logout = (req, res) => {
    res.cookie('JWT_COOKIE', 'logout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: 'success' })
}

exports.isLogin = async (req, res, next) => {
    if (req.cookies.JWT_COOKIE) {
        try {
            const tokens = jwt.verify(req.cookies.JWT_COOKIE, process.env.JWTSECRET);
            //check user có tồn tại hay ko
            const usersdata = await userModel.findById(tokens.id)
            if (!usersdata) {
                return next()
            }
            // thay đổi mk
            // if (usersdata.changedPasswordAfter(tokens.iat)) {
            //     return next()
            // }
            res.locals.user = usersdata
            return next()
        } catch (err) {
            console.log(err)
            return next()
        }
    }
    next()
}


exports.author = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return res.status(401).json({
                message: 'you are not authorized to access'
            })
        }
        next()
    }
}
exports.fogotpassword = async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({
            message: 'user chưa nhập email or chauw có'
        })
    }

    const resetoken = user.createResetPasswords();
    console.log(resetoken)
    await user.save({ validateBeforSave: false })
    const resetURL = `${req.protocol}://${req.get('host')}/users/resetpassword/${resetoken}`

    const message = `nếu bạn quên mật khẩu hãy ấn vào${resetURL}`
    try {
        // await sendmail({
        //     email: user.email,
        //     subject: 'bạn có 10 phút để đổi mật khẩu',
        //     message
        // })
        res.status(200).json({
            message: 'successful',
            status: 'thành công'
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'fail',
            status: 'token send fail',
            err: err
        })
    }
}
exports.resetpassword = async (req, res, next) => {
    try {
        const resetoken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        console.log(resetoken)
        const user = userModel.findOne({
            resetpassword: resetoken,
            passwordDuration: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(500).json({
                message: 'user can not reset password'
            })
        }
        user.password = req.body.password;
        user.comfirmPassword = req.body.comfirmPassword;
        user.passwordDuration = undefined;
        user.resetpassword = undefined;
        await user.save()

        createtoken(user, 200, res)
    }
    catch (err) {
        res.status(500).json({
            message: 'fail',
            status: err
        })
    }
}

exports.updatepassword = async (req, res, next) => {
    try {
        const users = await userModel.findById({ _id: req.user._id }).select('+password')
        if (!users) {
            return res.status(500).json({
                message: 'loi'
            })
        }
        console.log(users.password, req.body.passwordcurrent)
        if (!(users.password == req.body.passwordcurrent)) {
            return res.status(500).json({
                message: 'pass ko hợp lệ'
            })
        }
        users.password = req.body.password;

        await users.save();
        const token = tokens(users._id)
        res.status(200).json({
            status: 'thanh cong',
            token
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'update fail',
            status: err
        })
    }
}
const fillter = (obj, ...fieles) => {
    const newobj = {};
    Object.keys(obj).forEach(el => {
        if (fieles.includes(el)) newobj[el] = obj[el]
    })
    return newobj;
}
exports.updateFiels = async (req, res, next) => {
    try {

        if (req.body.password || req.body.comfirmPassword) {
            return res.status(400).json({
                status: 'ko được update password'
            })
        }
        const fillters = fillter(req.body, 'name', 'email');
        console.log(req.file)
        if (req.file) fillters.photo = req.file.filename
        const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, fillters, {
            new: true,
            runValidators: true
        })
        user.name = req.body.name
        await user.save()
        res.status(200).json({
            status: 'thanh cong',
            user
        })
    }
    catch (err) {
        res.status(500).json({
            status: err
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        await userModel.findByIdAndUpdate({ _id: req.user._id }, {
            active: false
        })
        res.status(204).json({
            message: 'delete succesful',
            data: null
        })
    } catch (err) {
        res.status(500).json({
            message: 'delete user fail',
            status: err
        })
    }
}
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}
exports.getAllUser = handleFactory.getAll(userModel)
exports.getUser = handleFactory.getOne(userModel)