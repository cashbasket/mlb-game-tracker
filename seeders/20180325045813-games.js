'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('games', require('../db/games.json'), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('games', null, {});
  }
};