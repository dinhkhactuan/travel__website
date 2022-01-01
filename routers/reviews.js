const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewsController = require('./../controllers/reviewControllers');
const usersControllers = require('../controllers/usersControllers')

router.use(usersControllers.authentication)

router.delete('/deleteReview/:id', usersControllers.author('user', 'admin'), reviewsController.deleteReview)
router.patch('/deleteReview/:id', usersControllers.author('user', 'admin'), reviewsController.updateReview)
router.get('/:id', reviewsController.getReview)
router.get('/', reviewsController.getAllReviews)
router.post('/', usersControllers.author('user'), reviewsController.createTourId, reviewsController.createReviews)
module.exports = router
