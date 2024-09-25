
const express = require('express');
const morgan = require('morgan');

const app = express();
const rateLimit = require('express-rate-limit'); 
const helmet = require('helmet')   
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');

const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');


// middlewares
// // 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// devlogging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
// app.use(morgan('dev'))

// Body Parser Express middleware to parse incoming JSON data
app.use(express.json());

// Data sanitization against NoSQL query injection  
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize', 'difficulty', 'price'
    ]
    }))

// serving static files
app.use(express.static(`${__dirname}/public/` ))

// creating our middleware


app.use((req, res,next)=>{
    req.requstTime = new Date().toISOString();  
    next();
})




app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req,res,next)=>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `can't find ${req.originalUrl} on the server`
    // })

    // const err = new Error(`can't find ${req.originalUrl} on the server`)
    // err.status = 'fail';
    // err.statusCode = 404;
    next(new AppError(`can't find ${req.originalUrl} on the server`,404));
})

// error handling middleware

app.use((err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})


const globalErrorHandler = require('./controllers/errorControler');

app.use(globalErrorHandler);


// start server
module.exports = app;
