"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "clients",
      [
        {
          name: "admin",
          settings: JSON.stringify([
            {
              name: "admin",
            },
          ]),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("clients", null, {});
  },
};
