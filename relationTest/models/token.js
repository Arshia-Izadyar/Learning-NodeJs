import { Model, DataTypes } from 'sequelize'


export default function(sequelize) {
    class Token extends Model {

    }
    Token.init({
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {sequelize, modelName:'Token',timestamps: true, freezeTableName: true})

    return Token
}