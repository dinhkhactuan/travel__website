const tours = require('../models/model');
const callApi = require('../utils/callApi')
const multer = require('multer')
const sharp = require('sharp')



// paramsmiddlware(req, res, next, val) {
//     console.log(`middlware${val}`);
//     next()
// }

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

exports.rezieTourImgage = async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next()
    req.body.imageCover = `tour-${req.params.id}.jpeg`
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`)
    req.body.images = []
    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${i + 1}.jpeg`
            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`)
            req.body.images.push(filename)
        })
    )
    console.log(req.body)
    next()
}
exports.updatetours = async (req, res) => {
    try {
        const data = await tours.findByIdAndUpdate({ _id: req.params.id },
            req.body, {
            new: true,
            runValidators: true
        }
        )
        res.status(200).json({
            message: 'succseful',
            data
        })
    }
    catch (err) {
        res.status(500).json({
            mesage: 'loisever',
            err
        })
    }
}
exports.tours = async (req, res) => {
    try {
        const tour = new callApi(tours.find(), req.query)
            .fillter()
            .sort()
            .fields()
            .phantrang()
        const datas = await tour.data
        res.json({
            message: 'succesful',
            datas
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'loi sever',
            data: err
        })
    };
}
exports.Posttours = (req, res) => {
    // console.log(req.body)
    tours.create(req.body)
        .then(data => res.json({
            message: 'succesful',
            data
        }))
        .catch(err => res.status(500).json({
            message: err
        }))
}
exports.Paramstours = async (req, res) => {
    try {
        const data = await tours.findById({ _id: req.params.id }).populate({
            path: 'Review'
        }).exec();
        res.json({
            message: 'succsetful',
            data
        })
    }
    catch (err) {
        // res.status(500).json({
        //     message: 'fail',
        //     data: err
        // })
        res.status(404).render('error')
    }
}
exports.check = async (req, res) => {
    try {
        const data = await tours.aggregate([
            {
                $match: { duration: { $gte: 5 } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    sum: { $sum: 1 },
                    TbcratingsAverage: { $avg: '$ratingsAverage' },
                    TbcratingsQuantity: { $avg: '$ratingsQuantity' },
                    minprice: { $min: '$price' },
                    maxprice: { $max: '$price' }
                }
            },
            {
                $sort: {
                    minprice: 1
                }
            }
        ])
        res.json({
            message: 'succsetful',
            data
        })
    } catch (error) {
        res.status(500).json({
            message: 'fail',
            data: error
        })
    }
}
exports.deletetours = async (req, res, next) => {
    try {
        const tour = await tours.deleteOne({ _id: req.params.id });
        res.status(203).json({
            message: 'successful',
            data: tour
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error
        })
    }
}
///tour-within/:disten/center/:latlng/unit/:unit
exports.getTourWithThin = async (req, res, next) => {
    try {
        const { disten, latlng, unit } = req.params
        const [lat, lng] = latlng.split(',');
        if (!lat || !lng) {
            res.status(500).json({
                status: 'fail'
            })
        }
        const radius = unit === 'mi' ? disten / 3963.2 : disten / 6378.1
        console.log(disten, latlng, unit)
        const tour = await tours.find({
            startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
        })
        console.log(tour)
        res.status(200).json({
            status: 'successfull',
            numberDoc: tour.length,
            data: {
                data: tour
            }
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            err
        })
    }
}
exports.getDistance = async (req, res, next) => {
    try {
        const { latlng, unit } = req.params
        const [lat, lng] = latlng.split(',');
        if (!lat || !lng) {
            res.status(500).json({
                status: 'fail'
            })
        }
        const distances = await tours.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'point',
                        coordinates: [lng * 1, lat * 1],
                    },
                    distanceField: 'distance'
                }
            },
            {
                $project: {
                    distance: 1,
                    name: 1
                }
            }
        ])
        res.status(200).json({
            status: 'successfull',
            data: {
                data: distances
            }
        })

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            err
        })
    }
}




