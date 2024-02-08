import { Model, DataTypes, Sequelize } from 'sequelize'



export default function(sequelize) {
    class Review extends Model {

    }

    Review.init({
        rate: {
            type: DataTypes.INTEGER,
            validate: {
                max: {args: [10], msg: 'max value is 10'},
                min: {args: [0], msg: 'min value is 0'}
            }
        },
        comment: {
            type: DataTypes.TEXT
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        },
        postId:{
            type: DataTypes.INTEGER,
            references: {
                model: 'Post',
                key: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    }, {sequelize, modelName: 'Review', freezeTableName: true, timestamps: true, indexes: [{unique: true, fields: ['userId', 'postId']}]})

    return Review
}