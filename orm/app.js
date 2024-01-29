import express from 'express';
import { sequelize } from './models/index.js';
import {router} from "./routes.js";


const app = express();
app.use(express.json())
app.use(router);

// try{

//     await sequelize.sync({force: true, alter: true});
// } catch(err){
//     console.log(err);
// }


app.listen(8000, console.log("server started...."));