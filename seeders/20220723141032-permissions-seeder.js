"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Permissions", [
      {
        name: "Personal Dashboard",
        for: "Dashboard",
        menu: 1,
        module: "root",
        url: "/",
        action: "PERSONAL_DASHBOARD",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Admin Dashboard",
        for: "Dashboard",
        menu: 1,
        module: "root",
        url: "/dashboard/admin",
        action: "ADMIN_DASHBOARD",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Create Roles",
        for: "Preferences",
        menu: 1,
        module: "Roles",
        url: "/preferences/create-roles",
        action: "CREATE_ROLES",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Roles",
        for: "Preferences",
        menu: 1,
        module: "Roles",
        url: "/preferences/view-roles",
        action: "VIEW_ROLES",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Permissions", null, {});
  },
};
