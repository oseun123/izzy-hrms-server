"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable("permissionroles", {
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Permissions",
          key: "id",
          onDelete: "cascade",
        },
      },
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Roles",
          key: "id",
        },
        onDelete: "cascade",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.dropTable("permissionroles");
  },
};
