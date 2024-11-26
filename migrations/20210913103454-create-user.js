"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: { model: "departments", key: "id" },
      },
      gender_id: {
        type: Sequelize.INTEGER,
        references: { model: "genders", key: "id" },
      },
      grade_id: {
        type: Sequelize.INTEGER,
        references: { model: "grades", key: "id" },
      },
      step_id: {
        type: Sequelize.INTEGER,
        references: { model: "steps", key: "id" },
      },
      designation_id: {
        type: Sequelize.INTEGER,
        references: { model: "designations", key: "id" },
      },
      employeecategory_id: {
        type: Sequelize.INTEGER,
        references: { model: "employeecategories", key: "id" },
      },
      employeestatus_id: {
        type: Sequelize.INTEGER,
        references: { model: "employeestatuses", key: "id" },
      },
      country_id: {
        type: Sequelize.INTEGER,
        references: { model: "countries", key: "id" },
      },
      state_id: {
        type: Sequelize.INTEGER,
        references: { model: "states", key: "id" },
      },

      branch_id: {
        type: Sequelize.INTEGER,
        references: { model: "branches", key: "id" },
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
    await queryInterface.dropTable("users");
  },
};
