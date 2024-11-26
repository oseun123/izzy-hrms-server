"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "grades",
      [
        {
          name: "Grade 1",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Grade 2",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Grade 3",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Grade 4",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Grade 4",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("grades", null, {});
  },
};
