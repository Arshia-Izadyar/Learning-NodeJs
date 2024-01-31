import express from 'express';
import { sequelize } from './models/index.js';
import {router as baseRouter} from "./routes/routes.js";
import {router as userRouter} from './routes/users.js';
import './auth.js';
import passport from 'passport';


const app = express();
app.use(express.json())
app.use('/accounts/', userRouter);
app.use(passport.authenticate('jwt', {session:false}), baseRouter);

// try{

//     await sequelize.sync({force: true, alter: true});
// } catch(err){
//     console.log(err);
// }


app.listen(8000, console.log("server started...."));