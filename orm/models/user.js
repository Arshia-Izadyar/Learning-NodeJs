// const { Model } = require('sequelize');


// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   User.init({
//     firstName: {type: DataTypes.STRING, allowNull: false},
//     lastName: DataTypes.STRING,
//     password: {type: DataTypes.STRING, allowNull: false}
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };

import { DataTypes } from "sequelize";

export default function(sequelize){
  return sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }

  })
}