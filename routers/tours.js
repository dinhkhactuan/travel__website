const express = require('express');
const router = express.Router();
const ToursControllers = require('../controllers/tourscontrollers')
const userCtronllers = require('../controllers/usersControllers')
const reviewRouter = require('./reviews')
// router.param('id', ToursControllers.paramsmiddlware);

router.use('/api/v1/:tourId/reviews', reviewRouter)


router.get('/tour-within/:disten/center/:latlng/unit/:unit', ToursControllers.getTourWithThin)

router.get('/distance/:latlng/unit/:unit', ToursControllers.getDistance)

router.get('/api/v1/tours/:id', ToursControllers.Paramstours);

router.put('/api/v1/tours/:id',
    userCtronllers.authentication,
    userCtronllers.author('admin', 'guides'),
    ToursControllers.multerUpload,
    ToursControllers.rezieTourImgage,
    ToursControllers.updatetours,
);

router.delete('/api/v1/tours/:id', userCtronllers.authentication, userCtronllers.author('admin', 'guides'), ToursControllers.deletetours);

router.get('/api/v1/tours', ToursControllers.tours);

router.get('/api/v1/checktours', userCtronllers.authentication, userCtronllers.author('admin', 'guides'), ToursControllers.check);

router.post('/api/v1/tours', userCtronllers.authentication, userCtronllers.author('admin', 'guides'), ToursControllers.Posttours);



// router.post('/api/v1/:tourId/reviews', userCtronllers.authentication, userCtronllers.author('user'), reviewsController.createReviews)

module.exports = router;