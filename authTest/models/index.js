import { Sequelize, DataTypes } from 'sequelize'

import User from './user.js'
import BlogPost from './blogpost.js'
import Rating from './rating.js'
import Token from './token.js'
import config from '../config/config.json' assert { type: "json" }


console.log(config['development'])

const sequelize = new Sequelize(config['development'])


const UserModel = User(sequelize)
const BlogModel = BlogPost(sequelize, DataTypes)
const RatingModel = Rating(sequelize, DataTypes)
const TokenModel = Token(sequelize, DataTypes)


export {UserModel, BlogModel, RatingModel, TokenModel};
