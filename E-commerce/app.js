'use strict';

const express = require('express');     
const dotenv = require('dotenv');
const morgan = require('morgan'); 

const connectDB = require('./db/connect');
const generalRouter = require('./router/general');
const authRouter = require('./router/authRouts');
const ErrorHandler = require('./middleware/error-handler');
const NotFoundError = require('./middleware/not-found');


require('express-async-errors');

dotenv.config()
const port = process.env.PORT;


const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(generalRouter);
app.use('/api/v1/auth', authRouter);
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
