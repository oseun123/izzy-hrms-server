"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("branches", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      phone_1: {
        type: Sequelize.STRING,
      },

      phone_2: {
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING,
      },
      headquarters: {
        type: Sequelize.BOOLEAN,
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: { model: "companys", key: "id" },
      },
      // state_id: {
      //   type: Sequelize.INTEGER,
      //   references: { model: "states", key: "id" },
      // },
      // country_id: {
      //   type: Sequelize.INTEGER,
      //   references: { model: "countrys", key: "id" },
      // },
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("branches");
  },
};
