"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Permissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      for: {
        type: Sequelize.STRING,
      },
      menu: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
      },
      module: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      action: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Permissions");
  },
};
