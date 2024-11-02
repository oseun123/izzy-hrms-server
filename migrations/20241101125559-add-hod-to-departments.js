"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("departments", "hod", {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if HOD is required
      references: {
        model: "users", // Name of the users table
        key: "id", // Key in the users table
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("departments", "hod");
  },
};
