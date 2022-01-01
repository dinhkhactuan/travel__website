const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booking = new Schema({
    name: {
        type: String,
        require: [true, 'name bắt buộc phải có'],
        trim: true,
    },
    price: {
        type: Number,
    },
    user: {
        type: Object.defineProperties,
        ref: 'users',
    },
    tours: {
        type: Object.ID,
        ref: 'tours',
    }

}, {
    collection: 'booking'
})

module.exports = mongoose.model('booking', booking)
