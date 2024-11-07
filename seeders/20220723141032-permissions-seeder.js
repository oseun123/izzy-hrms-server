"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("permissions", [
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
      {
        name: "Edit Roles",
        for: "Preferences",
        menu: 0,
        module: "Roles",
        url: "",
        action: "EDIT_ROLES",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Roles",
        for: "Preferences",
        menu: 0,
        module: "Roles",
        url: "",
        action: "DELETE_ROLES",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Assign Roles",
        for: "Preferences",
        menu: 1,
        module: "Roles",
        url: "/preferences/assign-roles",
        action: "ASSIGN_ROLES",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Create Department",
        for: "Preferences",
        menu: 1,
        module: "Department",
        url: "/preferences/create-departments",
        action: "CREATE_DEPARTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Department",
        for: "Preferences",
        menu: 1,
        module: "Department",
        url: "/preferences/view-departments",
        action: "VIEW_DEPARTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit Department",
        for: "Preferences",
        menu: 0,
        module: "Department",
        url: "",
        action: "EDIT_DEPARTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Department",
        for: "Preferences",
        menu: 0,
        module: "Department",
        url: "",
        action: "DELETE_DEPARTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Create Gender",
        for: "Preferences",
        menu: 1,
        module: "Gender",
        url: "/preferences/create-genders",
        action: "CREATE_GENDER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Gender",
        for: "Preferences",
        menu: 1,
        module: "Gender",
        url: "/preferences/view-genders",
        action: "VIEW_GENDER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit Gender",
        for: "Preferences",
        menu: 0,
        module: "Gender",
        url: "",
        action: "EDIT_GENDER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Gender",
        for: "Preferences",
        menu: 0,
        module: "Gender",
        url: "",
        action: "DELETE_GENDER",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Create State",
        for: "Preferences",
        menu: 1,
        module: "State",
        url: "/preferences/create-states",
        action: "CREATE_STATES",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View State",
        for: "Preferences",
        menu: 1,
        module: "State",
        url: "/preferences/view-states",
        action: "VIEW_STATES",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit State",
        for: "Preferences",
        menu: 0,
        module: "State",
        url: "",
        action: "EDIT_STATES",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete State",
        for: "Preferences",
        menu: 0,
        module: "State",
        url: "",
        action: "DELETE_STATES",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Create Country",
        for: "Preferences",
        menu: 1,
        module: "Country",
        url: "/preferences/create-countries",
        action: "CREATE_COUNTRY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Country",
        for: "Preferences",
        menu: 1,
        module: "Country",
        url: "/preferences/view-countries",
        action: "VIEW_COUNTRY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit Country",
        for: "Preferences",
        menu: 0,
        module: "Country",
        url: "",
        action: "EDIT_COUNTRY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Country",
        for: "Preferences",
        menu: 0,
        module: "Country",
        url: "",
        action: "DELETE_COUNTRY",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Create Company",
        for: "Preferences",
        menu: 1,
        module: "Company",
        url: "/preferences/create-companies",
        action: "CREATE_COMPANY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Company",
        for: "Preferences",
        menu: 1,
        module: "Company",
        url: "/preferences/view-companies",
        action: "VIEW_COMPANY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit Company",
        for: "Preferences",
        menu: 0,
        module: "Company",
        url: "",
        action: "EDIT_COMPANY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Company",
        for: "Preferences",
        menu: 0,
        module: "Company",
        url: "",
        action: "DELETE_COMPANY",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Create Branch",
        for: "Preferences",
        menu: 1,
        module: "Branch",
        url: "/preferences/create-branches",
        action: "CREATE_BRANCH",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Branch",
        for: "Preferences",
        menu: 1,
        module: "Branch",
        url: "/preferences/view-branches",
        action: "VIEW_BRANCH",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit Branch",
        for: "Preferences",
        menu: 0,
        module: "Branch",
        url: "",
        action: "EDIT_BRANCH",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Branch",
        for: "Preferences",
        menu: 0,
        module: "Branch",
        url: "",
        action: "DELETE_BRANCH",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Display",
        for: "Preferences",
        menu: 1,
        module: "Settings",
        url: "/preferences/display-settings",
        action: "SET_DISPLAY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Create Employee",
        for: "Human Resource",
        menu: 1,
        module: "Onboarding",
        url: "/human-resource/create-employee",
        action: "CREATE_EMPLOYEE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Create Designation",
        for: "Preferences",
        menu: 1,
        module: "Designation",
        url: "/preferences/create-designation",
        action: "CREATE_DESIGNATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Designation",
        for: "Preferences",
        menu: 1,
        module: "Designation",
        url: "/preferences/view-designation",
        action: "VIEW_DESIGNATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit Designation",
        for: "Preferences",
        menu: 0,
        module: "Designation",
        url: "",
        action: "EDIT_DESIGNATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Designation",
        for: "Preferences",
        menu: 0,
        module: "Designation",
        url: "",
        action: "DELETE_DESIGNATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Create Employee Category",
        for: "Preferences",
        menu: 1,
        module: "Employee Category",
        url: "/preferences/create-employee-category",
        action: "CREATE_EMPLOYEE_CATEGORY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Employee Category",
        for: "Preferences",
        menu: 1,
        module: "Employee Category",
        url: "/preferences/view-employee-category",
        action: "VIEW_EMPLOYEE_CATEGORY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit Employee Category",
        for: "Preferences",
        menu: 0,
        module: "Employee Category",
        url: "",
        action: "EDIT_EMPLOYEE_CATEGORY",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Employee Category",
        for: "Preferences",
        menu: 0,
        module: "Employee Category",
        url: "",
        action: "DELETE_EMPLOYEE_CATEGORY",
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Create Employee Category",
        for: "Preferences",
        menu: 1,
        module: "Employee Status",
        url: "/preferences/create-employee-status",
        action: "CREATE_EMPLOYEE_STATUS",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "View Employee Status",
        for: "Preferences",
        menu: 1,
        module: "Employee Status",
        url: "/preferences/view-employee-status",
        action: "VIEW_EMPLOYEE_STATUS",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Edit Employee Status",
        for: "Preferences",
        menu: 0,
        module: "Employee Status",
        url: "",
        action: "EDIT_EMPLOYEE_STATUS",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Delete Employee Status",
        for: "Preferences",
        menu: 0,
        module: "Employee Status",
        url: "",
        action: "DELETE_EMPLOYEE_STATUS",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Temporarily disable foreign key checks
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Truncate child and parent tables
    await queryInterface.sequelize.query("TRUNCATE TABLE permissionroles;");
    await queryInterface.sequelize.query("TRUNCATE TABLE permissions;");

    // Re-enable foreign key checks
    return await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  },
};
