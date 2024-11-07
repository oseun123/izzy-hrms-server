"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("employeecategories", [
      { name: "Full-Time", created_at: new Date(), updated_at: new Date() },
      { name: "Part-Time", created_at: new Date(), updated_at: new Date() },
      { name: "Temporary", created_at: new Date(), updated_at: new Date() },
      { name: "Contract", created_at: new Date(), updated_at: new Date() },
      { name: "Internship", created_at: new Date(), updated_at: new Date() },
      { name: "Freelance", created_at: new Date(), updated_at: new Date() },
      { name: "Seasonal", created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("employeecategories", null, {});
  },
};
