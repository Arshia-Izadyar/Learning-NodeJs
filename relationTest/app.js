import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload' 
import cookieParser from 'cookie-parser'    

import auth from './middlewares/authMiddleware.js'
import { sequelize } from './models/index.js'
import authRouter from './routers/authroute.js'
import postRouter from './routers/postRouter.js'
import notFound from './middlewares/notFound.js'


const app = express()
const port = 8000


app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser('jwt'))
app.use(express.urlencoded({'extended': false}))
app.use(fileUpload())

app.use('/auth', authRouter);
app.use('/post', postRouter);


app.use(notFound)

sequelize.sync({force: false})



app.listen(port, () => {console.log(`server started listening on port ${port}`)})