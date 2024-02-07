'use strict';
import { Model } from 'sequelize'


export default (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Rating.belongsTo(models.BlogPost, {
        foreignKey: 'blogPostId',
        as: 'blogPost',
      });
    }
  };
  Rating.init({
    userId: DataTypes.INTEGER,
    blogPostId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    review: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};