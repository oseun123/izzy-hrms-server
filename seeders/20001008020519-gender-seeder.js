"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "genders",
      [
        {
          name: "Male",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Female",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("genders", null, {});
  },
};
