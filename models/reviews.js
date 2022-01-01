const mongoose = require('mongoose');
const tour = require('./../models/model');
const slug = require('slugify');
// const userModel = require('./users')
const Schema = mongoose.Schema;

const reviews = new Schema({
    review: {
        type: String,
        trim: true,
        required: [true, 'reviews bắt buộc phải có']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'tours',
        // required: [true, 'tours bắt buộc phải có']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        // required: [true, 'user bắt buộc phải có']
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'reviews'
})

//đánh index và thêm tùy chọn để 1 user và tour ko đc trùng và duy nhất 1
reviews.index({ tour: 1, user: 1 }, { unique: true })

// điền trường
reviews.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name'
    }).populate({
        path: 'user'
    })
    next()
})
//phuowng thuwcs tĩnh tính trung bình rating
reviews.statics.avgRating = async function (tourId) {
    const status = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    //cập nhập tbc rating cho tour
    console.log(status)
    if (status.length > 0) {
        await tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: status[0].nRating,
            ratingsAverage: status[0].avgRating
        })
    } else {
        await tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}

reviews.post('save', function () {
    //this là chỉ tới review hiện tại 
    //constructor khởi tạo chỉ về tài liệu đã tạo ra tài liệu đó
    this.constructor.avgRating(this.tour)
})

reviews.pre(/^findByIdAnd/, async function (next) {
    this.r = await this.findOne()
    // console.log(this.r)
    next()
})

reviews.post(/^findByIdAnd/, async function () {
    await this.r.constructor.avgRating(this.r.tour)

})


module.exports = mongoose.model('reviews', reviews)