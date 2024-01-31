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
import bcrypt from 'bcrypt';

import { DataTypes } from "sequelize";

async function hashPassword(user){
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt);
}


export default function(sequelize){
  const User = sequelize.define('User', {
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

  },
  {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    },
  });

  User.prototype.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
  }

  return User;
}