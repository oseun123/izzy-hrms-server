"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("auditlogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },
      to_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },
      level: {
        type: Sequelize.STRING,
      },
      action: {
        type: Sequelize.STRING,
      },
      module: {
        type: Sequelize.STRING,
      },
      sub_module: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      payload: {
        type: Sequelize.TEXT,
      },
      ip: {
        type: Sequelize.STRING,
      },
      user_agent: {
        type: Sequelize.STRING,
      },
      message: {
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

    // await queryInterface.addIndex("auditlogs", [
    //   "action",
    //   "module",
    //   "sub_module",
    //   "description",
    //   "level",
    // ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("auditlogs");
  },
};
