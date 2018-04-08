const db = require('../models');

// Defining methods for the dashboardController
module.exports = {
  // update game by id
  updateGame: function (req, res) {
    db.game.update(req.body, {
      where: { 
        id: req.params.id
      }
    })
      .then(function (dbGame) {
        res.json(dbGame);
      });
  }
};
