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
              name: "Izzy",
              display: {
                navbar_variant: {
                  nav_variant_bg: "navbar-dark",
                  nav_variant: "navbar-gray",
                },
                dark_side_bar_variant: "sidebar-dark-orange ",
                sidebar_variant: "sidebar-light-warning",
                brand_variant: "navbar-white",
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
