"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "RoleUsers",
      [
        {
          created_at: new Date(),
          updated_at: new Date(),
          role_id: 1,
          user_id: 1,
        },
        {
          created_at: new Date(),
          updated_at: new Date(),
          role_id: 2,
          user_id: 1,
        },
        {
          created_at: new Date(),
          updated_at: new Date(),
          role_id: 1,
          user_id: 2,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("RoleUsers", null, {});
  },
};
