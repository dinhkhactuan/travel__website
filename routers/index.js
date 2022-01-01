
const routers = require('../routers/tours')
const appError = require('../error/appError');
const usersRouter = require('../routers/signup')
const errorControllers = require('../controllers/errorControllers');
const reviewsRouter = require('../routers/reviews')
const views = require('../routers/views');
const bookingRouter = require('../routers/booking');
function router(app) {
    app.use('/tours', reviewsRouter);
    app.use('/booking', bookingRouter);
    app.use('/users', usersRouter);
    app.use('/built', routers);
    app.use('/', views)
    app.all('*', (req, res, next) => {
        // res.status(404).json({
        //     message: `loi ${req.originalUrl} 404`
        // })
        // khacs
        // const err = new Error(`loi ${req.originalUrl} 404`);
        // err.status = 'fali';
        // err.statusCode = 404;
        res.status(404).render('error', {
            msg: 'trang này không tồn tại'
        })
        // next(new appError(`loi ${req.originalUrl} can't not find`, 404))
    })
    app.use(errorControllers)
}

module.exports = router;