const reviewsModel = require('./../models/reviews')
const handlefactory = require('./handleFactory')



exports.createTourId = async (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.users) req.body.users = req.user.id
    next()
}

exports.getAllReviews = handlefactory.getAll(reviewsModel)
exports.createReviews = handlefactory.createOne(reviewsModel)
exports.deleteReview = handlefactory.deleteOne(reviewsModel)
exports.updateReview = handlefactory.updateOne(reviewsModel)
exports.getReview = handlefactory.getOne(reviewsModel)