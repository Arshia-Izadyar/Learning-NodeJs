'use strict';
import { Model, DataTypes } from 'sequelize';
export default (sequelize) => {
  class BlogPost extends Model {
 
    // static associate(models) {
    //   BlogPost.hasMany(models.Rating, {
    //     foreignKey: 'blogPostId',
    //     as: 'reviews'
    //   })
    // }
  }

  BlogPost.init({
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    content: {type: DataTypes.STRING, allowNull:false},
    picture: {type: DataTypes.STRING, allowNull:true},
  }, {
    sequelize,
    modelName: 'BlogPost',freezeTableName: true
  });

  return BlogPost;
};