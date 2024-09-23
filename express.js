
const express = require('express');
const morgan = require('morgan');

const app = express();

const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');


// middlewares
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// app.use(morgan('dev'))

// Express middleware to parse incoming JSON data
app.use(express.json());
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
