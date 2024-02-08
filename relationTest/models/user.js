import { Model, DataTypes, Sequelize } from 'sequelize'
import bcrypt from 'bcrypt'

import {validateEmail} from '../utils/index.js'


async function hashPassword(user) {
    let salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
}



export default (sequelize) => {
    class User extends Model{
    }

    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            maxlength: 100,
            unique: true,
            validate: {
                len: [0, 100]
            }
            
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                customValidate(email){
                    validateEmail(email)
                }
            }
        }
    }, {sequelize, modelName: 'User', freezeTableName: true, timestamps: true, hooks: {beforeCreate: hashPassword, beforeUpdate: hashPassword}})

    User.prototype.checkPassword = async function(password) {
        return await bcrypt.compare(password, this.password)
    }
    
    return User
}