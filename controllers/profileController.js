const db = require('../models');
const moment = require('moment');
const Op = db.Sequelize.Op;

// Defining methods for the teamController
module.exports = {
  // Return data for single team
  profile: function(req, res) {
    db.user.findOne({
      where: {
        username: req.params.username
      },
      attributes: { 
        exclude: ['email', 'password', 'token', 'tokenExpires']
      },
      include: [{
        model: db.team,
        required: false,
        include: [{
          model: db.venue,
          required: false
        }]
      }]
    })
      .then(dbProfile => res.json({
        userInfo: dbProfile
      }))
      .catch(err => res.status(400).json(err));
  },
  
  // update user by id
  updateProfile: function (req, res) {
    db.user.update(req.body, {
      where: { 
        id: req.params.id,
        id: req.user.id
      }
    })
      .then(function (dbProfile) {
        res.json(dbProfile);
      });
  },

  pastGames: function(req, res) {
    db.game.findAll({
      where: { 
        gameDate: {
          [Op.lt]: moment()
        }
      },
      include: [{
        model: db.team,
        as: 'Home',
        required: true
      },
      {
        model: db.team,
        as: 'Away',
        required: true
      },
      {
        model: db.venue,
        required: true
      },
      {
        model: db.attendance,
        required: true,
        where: { 
          userId: req.params.id
        }
      }],
      order: [
        ['gameDate', 'DESC'],
        ['gameTime', 'DESC'],
      ]
    })
      .then(dbGames => res.json({
        pastGames: dbGames
      }))
      .catch(err => res.status(400).json(err));
  },
  
  upcomingGames: function(req, res) {
    db.game.findAll({
      where: { 
        gameDate: {
          [Op.gte]: moment()
        }
      },
      include: [{
        model: db.team,
        as: 'Home',
        required: true
      },
      {
        model: db.team,
        as: 'Away',
        required: true
      },
      {
        model: db.venue,
        required: true
      },
      {
        model: db.attendance,
        required: true,
        where: { 
          userId: req.params.id
        }
      }],
      order: [
        ['gameDate', 'ASC'],
        ['gameTime', 'ASC'],
      ]
    })
      .then(dbGames => res.json({
        upcomingGames: dbGames
      }))
      .catch(err => res.status(400).json(err));
  }
};
