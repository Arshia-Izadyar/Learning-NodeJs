'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class BlogPost extends Model {
 
    static associate(models) {
      BlogPost.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }

  BlogPost.init({
    title: {type: DataTypes.STRING, unique: true, allowNull: false},
    content: {type: DataTypes.STRING, allowNull:false},
    picture: {type: DataTypes.STRING, allowNull:true},
    userId: {type: DataTypes.INTEGER, allowNull: false}    
  }, {
    sequelize,
    modelName: 'BlogPost',
  });
  return BlogPost;
};