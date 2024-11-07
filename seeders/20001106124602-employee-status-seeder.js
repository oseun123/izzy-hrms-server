"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("employeestatuses", [
      {
        name: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Resigned",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Teminated",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("employeestatuses", null, {});
  },
};
