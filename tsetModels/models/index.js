import config from '../config/config.json' assert {type: 'json'}
import { Sequelize } from 'sequelize'
import BlogPostModel from './blogpost.js'
import RatingModel from './rate.js'


const sequelize = new Sequelize(config['development'])

const BlogPost = BlogPostModel(sequelize)
const Rating = RatingModel(sequelize)

BlogPost.hasMany(Rating, {as: 'reviews', foreignKey: 'blogPostId'})
Rating.belongsTo(BlogPost, {as: 'blogPost', foreignKey: 'blogPostId'})

// const models = {
//   BlogPost,
//   Rating
// };

// Set up associations
// Object.keys(models).forEach((modelName) => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });



export {sequelize, BlogPost, Rating}