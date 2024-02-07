'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Token.belongsTo(model.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  Token.init({
    token: DataTypes.STRING,
    userId: {type: DataTypes.INTEGER, allowNull: false}   
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};