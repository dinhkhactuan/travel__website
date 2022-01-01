const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingControllers');
const usersControllers = require('../controllers/usersControllers')

router.get('/check-sessions/:tourId',
    usersControllers.authentication,
    bookingsController.checkSessions
)

module.exports = router
