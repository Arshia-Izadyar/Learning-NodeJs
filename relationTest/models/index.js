import { Sequelize } from "sequelize";


import config from '../config/config.json' assert {type: 'json'}
import PostModel from './post.js'
import UserModel from './user.js'
import TokenModel from "./token.js";
import ReviewModel from "./review.js";

const sequelize = new Sequelize(config['development'])

const Post = PostModel(sequelize)
const User = UserModel(sequelize)
const Review = ReviewModel(sequelize)
const Token = TokenModel(sequelize)

User.hasMany(Review, {foreignKey: 'userId', as: 'reviews'})
Review.belongsTo(User, {foreignKey: 'userId', as: 'user'})

Post.hasMany(Review, {foreignKey: 'postId', as: 'reviews'})
Review.belongsTo(Post, {foreignKey: 'postId', as: 'post'})

User.hasOne(Token, {'foreignKey': 'userId', as: 'token'})
Token.belongsTo(User, {foreignKey: 'userId', as: 'user'})


export {sequelize, Post, User, Review, Token}
