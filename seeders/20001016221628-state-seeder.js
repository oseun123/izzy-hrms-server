"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "states",
      [
        {
          name: "Adamawa",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Bauchi",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Benue",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Borno",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Gombe",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Jigawa",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Kaduna",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Kano",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Katsina",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Kebbi",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Kogi",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Kwara",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Nasarawa",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Niger",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Plateau",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Sokoto",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Taraba",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Yobe",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Zamfara",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Ekiti",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Lagos",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Ogun",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Ondo",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Osun",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Oyo",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Edo",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Delta",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Abia",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Anambra",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Akwa Ibom",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Bayelsa",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Cross River",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Ebonyi",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Enugu",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Imo",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Rivers",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("states", null, {});
  },
};
