const mongoose = require('mongoose');
const slug = require('slugify');
// const userModel = require('./users')
const Schema = mongoose.Schema;

const natours = new Schema({
    name: {
        type: String,
        require: [true, 'user ko ton tai'],
        unique: true,
        trim: true
    },
    slug: { type: String, slug: 'name' },
    toursnone: {
        type: Boolean,
        default: false
    },
    duration: {
        type: Number,
        default: 5,
    },
    maxGroupSize: {
        type: Number,
        require: [true, 'chưa có maxgroup'],
    },
    difficulty: {
        type: String,
        required: [true, 'chưa có đọ khó']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        set: val => Math.round(val * 10) / 10 //mỗi khi có giá trị mới hàm này sẽ đc chạy .round => giá trị hiện tại
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        require: [true, 'gia ko ton tai']
    },
    summary: {
        type: String,
        trim: true,
        require: [true, 'chưa có summary']
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        require: [true, 'chưa có hình ảnh']
    },
    images: [String],
    startDates: [Date],
    //nhúng dữ liệu location (địa điểm)
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'users'
        }
    ]

}, {
    timestamps: true,
    collection: 'tours',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//đặt index cho trường nhiều truy vẫn để cái thiện hiệu xuất
natours.index({ price: 1, ratingsAverage: -1 })
natours.index({ slug: 1 })
//đặt index cho trường startLocation vị trí trái đất
natours.index({ startLocation: '2dsphere' })
// trường ảo
natours.virtual('dirationWeek')
    .get(function () {
        return this.duration / 7
    });

//virtual populate (dân số ảo)
natours.virtual('Review', {
    ref: 'reviews',
    foreignField: 'tour',
    localField: '_id'
})


//tài liệu trung gian (document middware) dùng cho sự kiện save() and create()
natours.pre('save', function (next) {
    this.slug = this.name;
    next()
})

natours.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
    })
    next()
})

//nhúng
// natours.pre('save', async function (next) {
//     const datagiudes = this.guides.map(async id => await userModel.findById({ _id: id }))
//     console.log(datagiudes)
//     this.guides = await Promise.all(datagiudes)
//     next()
// })


// natours.pre('save', function (next) {
//     console.log('hh');
//     next()
// })


// natours.post('save', function (docs, next) {
//     console.log(docs);
//     next()
// })

// query middware
// natours.pre(/^find/, function (next) {
//     this.find({ toursnone: { $ne: true } })
//     next()
// })


// natours.post(/^find/, function (docs, next) {
//     console.log(docs)
//     next()
// })

//aggregate middware
// natours.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { toursnone: { $ne: true } } })
//     next()
// })
module.exports = mongoose.model('tours', natours)