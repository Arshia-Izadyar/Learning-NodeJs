'use strict';

require('express-async-errors');  // Import express-async-errors
const express = require('express');   
const fileUpload = require('express-fileupload');  
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const CookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit'); 
const xss = require('xss-clean');
const corse = require('cors');
const mongoSanitize = require('express-mongo-sanitize') 


const connectDB = require('./db/connect');
const generalRouter = require('./router/general');
const userRouter = require('./router/userRoutes');
const authRouter = require('./router/authRouts');
const reviewRouter = require('./router/reviewRoutes');
const orderRouter = require('./router/orderRoutes');
const productRouter = require('./router/productRoutes');
const NotFoundError = require('./middleware/not-found');
const ErrorHandler = require('./middleware/error-handler');
const helmet = require('helmet');

// const authenticateUser = require('./middleware/authentication');



dotenv.config()
const port = process.env.PORT;


const app = express();
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
}));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize())


app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(fileUpload());
app.use(CookieParser(process.env.JWT_SECRET))
app.use(express.json());
// app.use(generalRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use(NotFoundError);
app.use(ErrorHandler);



async function start(){
    try {
        app.listen(port, () => {console.log(`server started at port ${port}...`)})
        await connectDB(process.env.MONGO_URL);
    } catch (err) {
        console.log(err);
    }

}

start();
