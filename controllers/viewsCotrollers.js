const Tour = require('./../models/model')
const reviews = require('./../models/reviews')

exports.getOverviews = async (req, res, next) => {
    const tours = await Tour.find({})
    res.render('overview', {
        title: 'page overview',
        tours
    })
}
exports.getTour = async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'Review',
        fields: 'review rating user'
    })
    if (!tour) {
        res.status(404).render('error', {
            msg: 'không có chuyến lưu diễn nào với cái tên đó'
        })
    }
    res.set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
        .render('tour', {
            title: 'page tour',
            tour
        })

}

exports.getLogin = async (req, res, next) => {

    res.status(200).render('login')
}

exports.getMe = async (req, res, next) => {
    res.status(200).render('account')
}