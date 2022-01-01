const express = require('express');
const path = require('path');
const routers = require('./routers/index');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const database = require('./config/db/connect');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

//mũ bảo hiểm headers
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "script-src": ["'self'", "cdn.jsdelivr.net/npm/axios/dist/axios.min.js"],
        "style-src": ["'self'", "fonts.googleapis.com/css"],
    },
})
)
//biến moi trơngf
dotenv.config({ path: './config.env' });
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
database.connect()
//giới hạn req
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 200,
    message: 'lỗi có quá nhiều truy cập từ id này'
});
app.use('/api', limiter);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use(cookieParser())
//chống lại tiêm truy vấn độc hại noSQL
app.use(mongoSanitize());

//chóng lại mã html đọc hại
app.use(xss())

//chống lại params độc hại
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'price',
        'maxGroupSize'
    ]
}));

app.use((req, res, next) => {
    next()
})
routers(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('yes')
})