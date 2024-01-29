'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      username:{
        type:Sequelize.STRING(40),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addColumn('Contacts', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contacts', 'UserId');
    await queryInterface.dropTable('Users');
  }
};