'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the enum column
    await queryInterface.addColumn('users', 'record_status', {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    });

    // Add an index on the column
    await queryInterface.addIndex('users', ['record_status'], {
      name: 'users_record_status_index',
    });

    // Add created_by column (FK to users.id)
    await queryInterface.addColumn('users', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index safely
    try {
      await queryInterface.removeIndex('users', 'users_record_status_index');
    } catch (err) {
      console.warn('Index not found, skipping:', err.message);
    }

    // Remove record_status column safely
    try {
      await queryInterface.removeColumn('users', 'record_status');
    } catch (err) {
      console.warn('record_status not found, skipping:', err.message);
    }

    // Remove created_by column safely
    try {
      await queryInterface.removeColumn('users', 'created_by');
    } catch (err) {
      console.warn('created_by not found, skipping:', err.message);
    }
  },
};
