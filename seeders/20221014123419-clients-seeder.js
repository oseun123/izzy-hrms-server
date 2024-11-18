"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "clients",
      [
        {
          name: "Izzy",
          settings: JSON.stringify([
            {
              name: "Izzy",
              display: {
                navbar_variant: {
                  nav_variant_bg: "navbar-light",
                  nav_variant: "navbar-light",
                },
                dark_side_bar_variant: "sidebar-dark-orange ",
                sidebar_variant: "sidebar-light-primary",
                brand_variant: "navbar-light",
              },
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
