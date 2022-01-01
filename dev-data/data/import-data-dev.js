const fs = require('fs');
const mongoose = require('mongoose');
const tours = require('./../../models/model')
const reviews = require('./../../models/reviews')
const users = require('./../../models/users')

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/natours');
        console.log('connect successfully');
    } catch (error) {
        console.log('connect failed');
    }
}
connect()
const tourses = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const review = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const user = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const importdata = () => {
    tours.create(tourses)
    reviews.create(review)
    users.create(user, { validateBeforeSave: false })
        .then(() => { console.log('succsessful') })
        .catch(err => console.log(err))
}
const deletedata = async () => {
    await tours.deleteMany()
    await reviews.deleteMany()
    await users.deleteMany()
        .then(() => { console.log('delete succsessful') })
        .catch(err => console.log(err))
}
if (process.argv[2] === '--import') {
    importdata()
}
else if (process.argv[2] === '--delete') {
    deletedata()
}