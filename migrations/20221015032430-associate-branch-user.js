"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("branchmanagers", {
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "branches",
          key: "id",
          onDelete: "cascade",
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "cascade",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("branchmanagers");
  },
};
