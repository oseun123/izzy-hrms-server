"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "Employee",
          default: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Administrator",
          default: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("roles", null, {});
  },
};
