'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('BlogPosts', 'blogPostId', {
      type: Sequelize.INTEGER,
        references: {
          model: 'Ratings',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
