'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user_profiles', 'user_role_id', { type: Sequelize.INTEGER }).then(() => {
      return queryInterface.addColumn('user_profiles', 'permit_status_id', { type: Sequelize.INTEGER }).then(() => {
        return queryInterface.addColumn('user_profiles', 'employ_status_id', { type: Sequelize.INTEGER }).then(() => {
          return queryInterface.addColumn('user_profiles', 'program_id', { type: Sequelize.INTEGER }).then(() => {
            return queryInterface.addIndex('user_profiles', ['user_role_id']).then(() => {
              return queryInterface.addIndex('user_profiles', ['permit_status_id']).then(() => {
                return queryInterface.addIndex('user_profiles', ['employ_status_id'])
              })
            })
          })
        })
      })
    })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('user_profiles', 'user_role_id').then(() => {
        return queryInterface.removeColumn('user_profiles', 'permit_status_id').then(() => {
          return queryInterface.removeColumn('user_profiles', 'employ_status_id')
        })
      })
  }
};
