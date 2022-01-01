const multer = require('multer')
const sharp = require('sharp')


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
exports.multerUpload = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
])