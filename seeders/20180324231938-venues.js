'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('venues', require('../db/venues.json'), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('venues', null, {});
  }
};
