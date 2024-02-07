'use strict';
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

async function hashPassword(user){
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
}

export default function(sequelize){
  const User = sequelize.define('User', {
    first_name:{
      type: DataTypes.STRING, 
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING, 
      unique: true,
      allowNull: false
    },
    is_valid: {
      type: DataTypes.BOOLEAN, 
      default: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }

  },{
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    },
  })

  User.prototype.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
  }

  return User;
}
