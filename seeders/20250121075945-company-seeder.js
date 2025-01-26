'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch client names from the 'clients' table
    const clients = await queryInterface.sequelize.query(
      'SELECT name FROM clients;',
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    // Prepare data for bulk insert into 'companys' table
    const companyData = clients.map((client) => ({
      name: client.name,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert data into 'companys' table
    return queryInterface.bulkInsert('companys', companyData);
  },

  async down(queryInterface, Sequelize) {
    // Undo the insert
    return queryInterface.bulkDelete('companys', null, {});
  },
};
