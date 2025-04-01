'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Events', 'categoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Categories',  // Ensure this table exists
        key: 'categoryId',
      },
      onUpdate: 'CASCADE',   // Optional: how to handle updates
      onDelete: 'SET NULL',  // Optional: how to handle deletes
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'categoryId');
  },
};
