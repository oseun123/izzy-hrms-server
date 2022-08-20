"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable("RoleUsers", {
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Roles",
          key: "id",
        },
        onDelete: "cascade",
        // onUpdate: "cascade",
      },
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Users",
          key: "id",
          onDelete: "cascade",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable("RoleUsers");
  },
};
