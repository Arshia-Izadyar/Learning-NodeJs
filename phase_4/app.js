const express = require('express'); 
// import express from 'express';
const morgan = require('morgan');

const routes = require('./routes');

const app = express();
const router = express.Router();


function middleware(req, res, next){
    console.log(req.url);
    let time = new Date().toISOString().padEnd(2);
    console.log(time);

    next()
}

app.use(express.json());
app.use(middleware);
app.use(morgan('dev'));
app.use('/api/v1',router);
app.use(routes);


function getTours(req, res){
    let id = req.params.id;
    console.log(id);
    res.status(200).json({"status":"ok"});

}

router.route('/tours/:id').get(getTours);


const port = 8000;
app.listen(port, () => {console.log(`server started at ${port} ....`)});