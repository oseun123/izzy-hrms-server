"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "designations",
      [
        {
          name: "Software Engineer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Senior Software Engineer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Project Manager",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Technical Lead",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Data Analyst",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Business Analyst",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Product Manager",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Quality Assurance Engineer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "DevOps Engineer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "System Administrator",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "UX/UI Designer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Front-end Developer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Back-end Developer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Full Stack Developer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "IT Support Specialist",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Network Engineer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Database Administrator",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Machine Learning Engineer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Cybersecurity Specialist",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Technical Writer",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("designations", null, {});
  },
};
