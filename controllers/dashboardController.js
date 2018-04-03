const db = require('../models');
const moment = require('moment');
const Op = db.Sequelize.Op;

// Defining methods for the dashboardController
module.exports = {
  // Return data for dashboard 
  user: function(req, res) {
    const username = req.params.username;
    db.user.findOne({
      where: {
        username: username
      }
    }).then(dbDash => res.json({
      user: dbDash
    })).catch(err => res.status(400).json(err));
  },
  gamesAttended: function(req, res) {
    const userId = req.params.userId;
    db.attendance.count({
      where: {
        userId: userId
      },
      include: [{
        model: db.game,
        required: true,
        where: { 
          gameDate: {
            [Op.lte]: moment()
          }
        }
      }]
    })
      .then(dbDash => res.json({
        count: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  postsCount: function(req, res) {
    const userId = req.params.userId;
    db.post.count({
      where: {
        userId: userId
      }
    })
      .then(dbDash => res.json({
        count: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  ballparkCount: function(req, res) {
    const userId = req.params.userId;
    db.game.count({
      where: {
        gameDate: {
          [Op.lte]: moment()
        }
      },
      include: [{
        model: db.attendance,
        required: true,
        where: { 
          userId: userId
        }
      }],
      col: 'venueId',
      distinct: true
    })
      .then(dbDash => res.json({
        count: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  wins: function(req, res) {
    const userId = req.params.userId;
    db.user.count({
      where: {
        id: userId
      },
      include: [{
        model: db.attendance,
        required: true,
        include: [{
          model: db.game,
          required: true,
          where: { 
            gameDate: {
              [Op.lte]: moment()
            },
            winningTeamId: {$col: 'user.teamId'}
          }
        }]
      }],
    })
      .then(dbDash => res.json({
        wins: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  losses: function(req, res) {
    const userId = req.params.userId;
    db.user.count({
      where: {
        id: userId
      },
      include: [{
        model: db.attendance,
        required: true,
        include: [{
          model: db.game,
          required: true,
          where: { 
            gameDate: {
              [Op.lte]: moment()
            },
            losingTeamId: {$col: 'user.teamId'}
          }
        }]
      }],
    })
      .then(dbDash => res.json({
        losses: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  last: function(req, res) {
    const userId = req.params.userId;
    db.game.findOne({
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
          userId: userId
        }
      }], 
      order: [
        ['gameDate', 'DESC'],
        ['gameTime', 'DESC'],
      ]
    })
      .then(dbDash => res.json({
        game: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  upcoming: function(req, res) {
    const userId = req.params.userId;
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
          userId: userId
        }
      }], 
      order: [
        ['gameDate', 'ASC'],
        ['gameTime', 'ASC'],
      ]
    })
      .then(dbDash => res.json({
        games: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  recentPosts: function(req, res) {
    const userId = req.params.userId;
    db.post.findAll({
      include: [{
        model: db.game,
        required: true
      },{
        model: db.user,
        required: true,
        attributes: { exclude: ['email', 'password', 'token', 'tokenExpires'] }
      }],
      order: [
        ['postDate', 'DESC']
      ]
    })
      .then(dbDash => res.json({
        posts: dbDash
      }))
      .catch(err => res.status(400).json(err));
  }
};
