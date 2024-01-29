'use strict';

const {faker, fa, da} = require('@faker-js/faker');


function createNumber(low, high){
  return Math.round(Math.random() * (high - low) + low)
}


function createContacts({count, contactCategory, users}){
  let data = [];

  for (let i = 0; i < count; i++){
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let mobilePhone = faker.number.int({min:100, max:1000});
    let is_favorite = faker.datatype.boolean();
    let createdAt = faker.date.past();
    let updatedAt = faker.date.past();
    let UserId = users[createNumber(0, users.length - 1)].id;
    let ContactCategoryId = contactCategory[createNumber(0, contactCategory.length - 1)].id;
    console.log(users[users.length-1])

    let record = {
      firstName,
      lastName,
      mobilePhone,
      is_favorite,
      createdAt,
      updatedAt,
      UserId,
      
    };
    data.push(record)

  }
  return data;
}



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [contactCategory] = await queryInterface.sequelize.query('SELECT id FROM "ContactCategories";');
    const [users] = await queryInterface.sequelize.query('SELECT id FROM "Users";')
    await queryInterface.bulkInsert('Contacts', createContacts({count: 50, contactCategory: contactCategory, users: users}));
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Contacts', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
