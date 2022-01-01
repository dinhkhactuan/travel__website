const express = require('express');
const router = express.Router();
const viewsControllers = require('./../controllers/viewsCotrollers')
const userControllres = require('./../controllers/usersControllers')

router.use(userControllres.isLogin)

router.get('/', viewsControllers.getOverviews)
router.get('/tour/:slug', viewsControllers.getTour)
router.get('/login', viewsControllers.getLogin)
router.get('/me', viewsControllers.getMe)

module.exports = router
