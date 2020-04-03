'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user_categories', 'license_no', {
      type: Sequelize.STRING,
      defaultValue: ''
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'user_categories',
      'license_no'
    )
  }
};
