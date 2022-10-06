"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        first_name: "Seun",
        last_name: "Ogunsanya",
        email: "oseun04@yahoo.com",
        password:
          "$2a$12$8Z7mQ2vZsTUp3Hj1.8/YP.VLldS.4JtxdY0C8BEiv24hT9nOS8cjm",
        department_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Bolanle",
        last_name: "Ogunsanya",
        email: "abisolaogunsanya23@gmail.com",
        password:
          "$2a$12$8Z7mQ2vZsTUp3Hj1.8/YP.VLldS.4JtxdY0C8BEiv24hT9nOS8cjm",
        department_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("users", null, {});
  },
};
