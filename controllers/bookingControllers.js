const stripe = require('stripe')('sk_test_51K5SvHFzeJR1ZxRvbmRnRyovbukRbpePre3qxR8R29RYXASn4ZmLDyNj7cJw03cmRswEk6XjksdXxjxd26erWxhW000Z3WYy7b')
const tourModel = require('../models/model')
exports.checkSessions = async (req, res, next) => {
    try {
        const tour = await tourModel.findById({ _id: req.params.tourId })
        const sessions = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/`,
            cancel_url: `${req.protocol}://${req.get('host')}/me`,
            customer_email: req.user.email,
            client_reference_id: req.params.tourId,
            line_items: [
                {
                    name: `${tour.name} Tour`,
                    description: tour.summary,
                    images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                    amount: tour.price * 100,
                    currency: 'usd',
                    quantity: 1
                }
            ]
        })
        res.status(200).json({
            status: 'thanh cong',
            sessions
        })
    } catch (err) {
        res.status(500).json({
            status: err,
        })
    }
}

// exports.createBooking = async (req, res, next) => {
//     const
// }
