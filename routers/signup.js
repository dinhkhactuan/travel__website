const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/usersControllers')


router.post('/signup', usersControllers.createUser)
router.post('/login', usersControllers.login)
router.get('/logout', usersControllers.logout)
router.post('/fogotpassword', usersControllers.fogotpassword)
router.patch('/resetpassword/:token', usersControllers.resetpassword)

router.use(usersControllers.authentication)

router.get('/me', usersControllers.getMe, usersControllers.getUser)

router.patch('/updateFiels', usersControllers.uploadFile, usersControllers.rezieImg, usersControllers.updateFiels);
router.patch('/updatepassword', usersControllers.updatepassword);

router.use(usersControllers.author('admin'))

router.get('/getuser', usersControllers.getAllUser)
router.get('/getuser/:id', usersControllers.getUser)
router.delete('/deleteuser', usersControllers.deleteUser)


module.exports = router;