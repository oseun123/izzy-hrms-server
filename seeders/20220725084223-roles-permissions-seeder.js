"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      "permissionroles",
      [
        {
          created_at: new Date(),
          updated_at: new Date(),
          permission_id: 1,
          role_id: 2,
        },
        {
          created_at: new Date(),
          updated_at: new Date(),
          permission_id: 2,
          role_id: 2,
        },
        {
          created_at: new Date(),
          updated_at: new Date(),
          permission_id: 3,
          role_id: 2,
        },
        {
          created_at: new Date(),
          updated_at: new Date(),
          permission_id: 4,
          role_id: 2,
        },
        {
          created_at: new Date(),
          updated_at: new Date(),
          permission_id: 1,
          role_id: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("permissionroles", null, {});
  },
};
