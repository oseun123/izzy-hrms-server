'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('branches', [
      {
        name: 'Headquater',
        company_id: 1,
        address: '',
        email: 'headquaters@company.com',
        code: 'RC-0015',
        phone_1: '123-456-7890',
        phone_2: '098-765-4321',
        headquarters: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('branches', null, {});
  },
};
