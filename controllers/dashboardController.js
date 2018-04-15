const db = require('../models');
const moment = require('moment');
const Op = db.Sequelize.Op;

// database time is in EST and moment time is in UTC, so we must compensate
const nowEST = moment().subtract({ hours: 4 });

// Defining methods for the dashboardController
module.exports = {
  gamesAttended: function(req, res) {
    const userId = req.user ? req.user.id : null;
    db.attendance.count({
      where: {
        userId: userId
      },
      include: [{
        model: db.game,
        required: true,
        where: { 
          gameDate: {
            [Op.lte]: nowEST
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
    const userId = req.user ? req.user.id : null;
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
    const userId = req.user ? req.user.id : null;
    db.game.count({
      where: {
        gameDate: {
          [Op.lte]: nowEST
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
    const userId = req.user ? req.user.id : null;
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
              [Op.lte]: nowEST
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
    const userId = req.user ? req.user.id : null;
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
              [Op.lte]: nowEST
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
    const userId = req.user ? req.user.id : null;
    db.game.findOne({
      where: { 
        gameDate: {
          [Op.lt]: nowEST
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
        required: false,
        include: [{
          model: db.user,
          required: true,
          exclude: ['email', 'password', 'token', 'tokenExpires'],
          where: {
            id: userId
          }
        }],
      }],
      order: [
        ['gameDate', 'DESC']
      ]
    })
      .then(dbDash => res.json({
        game: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  upcoming: function(req, res) {
    const userId = req.user ? req.user.id : null;
    db.game.findAll({
      where: { 
        gameDate: {
          [Op.gte]: nowEST
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
        ['gameDate', 'ASC']
      ]
    })
      .then(dbDash => res.json({
        games: dbDash
      }))
      .catch(err => res.status(400).json(err));
  },
  recentPosts: function(req, res) {
    const userId = req.user ? req.user.id : null;
    db.post.findAll({
      include: [{
        model: db.game,
        required: true,
        include: [{
          model: db.team,
          as: 'Home',
          required: true
        },
        {
          model: db.team,
          as: 'Away',
          required: true
        }]
      },{
        model: db.user,
        required: true,
        attributes: { exclude: ['email', 'password', 'token', 'tokenExpires'] }
      }],
      order: [
        ['postDate', 'DESC']
      ],
      limit: 10
    })
      .then(dbDash => res.json({
        posts: dbDash
      }))
      .catch(err => res.status(400).json(err));
  }
};
