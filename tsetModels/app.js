import express from 'express';

import {sequelize} from './models/index.js'
import router from './routers/blogPostRouter.js'


const app = express();
const port  = 8000;
import fileUpload from 'express-fileupload';  

app.use(fileUpload());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

sequelize.sync({force: false})
app.use(router)


app.listen(port, () => {console.log(`server is running at port ${port}....`);})