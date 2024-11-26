"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "steps",
      [
        {
          name: "Step 1",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Step 2",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Step 3",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Step 4",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Step 4",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("steps", null, {});
  },
};
