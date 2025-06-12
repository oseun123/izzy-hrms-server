'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'setup_token', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'password', // Optional: only works with some dialects like MySQL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'setup_token');
  },
};
