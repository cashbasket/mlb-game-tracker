const db = require('../models');
const moment = require('moment');
const Op = db.Sequelize.Op;

// Defining methods for the dashboardController
module.exports = {
  games: function(req, res) {
    db.game.findAll({
      where: {
        awayTeamScore: null,
        gameDate: {
          [Op.lte]: moment()
        }
      }
    })
      .then(dbGames => res.json({
        games: dbGames
      }))
      .catch(err => res.status(400).json(err));
  },
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
