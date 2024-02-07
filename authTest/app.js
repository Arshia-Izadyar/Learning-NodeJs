import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';  

import {router as authRouter} from './routers/authRouter.js'
import blogRouter from './routers/blogPostRouter.js'
import verifyJWT from './middlewares/verifyJWT.js'

const app = express();
const port  = 8000;

app.use('/static',express.static('./public'));
app.use(express.json());
app.use(fileUpload());

app.use(express.urlencoded({extended: false}));
app.use(cookieParser('jwt'))
app.use('/auth', authRouter);
app.use('/blog',verifyJWT, blogRouter);


app.listen(port, () => {console.log(`server is running at port ${port}....`);})