// In add-index-to-auditlogs.js migration file
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add index only on the most essential columns
    await queryInterface.addIndex("auditlogs", [
      { name: "action", length: 191 },
      { name: "module", length: 191 },
      { name: "sub_module", length: 191 },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("auditlogs", [
      "action",
      "module",
      "sub_module",
    ]);
  },
};
