const express = require('express');
const cors = require('cors');
const notFound = require("./middleware/not-found");
const connectToDB = require("./db/connect"); 
const taskRouter = require("./route/urls");
const customErrorHandler = require("./middleware/error_handler");

require("dotenv").config();
const app = express();
const port = process.env.PORT;
const dbConnectionString = process.env.MONGO_URL;


// middleware
app.use(cors())
app.use(express.json());
app.use(express.static("./public"))
app.use(express.urlencoded({extended: false}));
app.use("/api/v1/tasks", taskRouter);
app.use(notFound);
app.use(customErrorHandler);


function startApp(dbUrl, port){
    
    try{

        connectToDB(dbUrl);
        console.log("db connection established");
        app.listen(port, () => {console.log(`server started at port ${port}`)});
    } catch(err) {
        console.log(err);
    }

}

startApp(dbConnectionString, port);