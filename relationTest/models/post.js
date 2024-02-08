import { Model, DataTypes, Sequelize } from 'sequelize'



export default function(sequelize) {
    class Post extends Model {

    }

    Post.init({
        title: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                len: [0, 200]
            }
        },
        slug: {
            type: DataTypes.STRING,
            unique: true
        },
        content: {
            type: DataTypes.TEXT
        }
    }, {sequelize, modelName: 'Post', freezeTableName: true, timestamps: true})
    return Post
}