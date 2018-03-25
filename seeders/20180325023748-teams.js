'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('teams', require('../db/teams.json'), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('teams', null, {});
  }
};