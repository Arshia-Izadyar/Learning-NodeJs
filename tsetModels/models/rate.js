'use strict';
import { Model, DataTypes } from 'sequelize'


export default (sequelize) => {
  class Rating extends Model {
    // static associate(models) {

    //   Rating.belongsTo(models.BlogPost, {
    //     foreignKey: 'blogPostId',
    //     as: 'blogPost',
    //   });
    // }
  };
  Rating.init({
    blogPostId: {type:DataTypes.INTEGER, references: {model: 'BlogPost', key: 'id'}},
    score: DataTypes.INTEGER,
    review: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Rating',freezeTableName: true
  });
  
  return Rating;
};