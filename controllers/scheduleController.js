const db = require('../models');
const Op = db.Sequelize.Op;
const moment = require('moment');

// Defining methods for the teamController
module.exports = {
  
  // Return team schedule
  schedule: function(req, res) {
    const userId = req.user ? req.user.id: null;
    const startDate = (req.query.start) ? req.query.start : moment().format('YYYYMMDD');
    const endDate = (req.query.end) ? req.query.end : moment().add(1, 'years').format('YYYYMMDD');
    db.game.findAll({
      where: {
        [Op.and]: [{
          [Op.or]: [{awayTeamId: req.params.id}, {homeTeamId: req.params.id}]
        }, {
          gameDate: {
            [Op.gte]: startDate
          }
        }, {
          gameDate: {
            [Op.lte]: endDate
          }
        }]
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
        where: { userId: userId }
      }],
      order: [
        ['gameDate', 'ASC']
      ]
    })
      .then(dbGame => res.json({
        games: dbGame
      }))
      .catch(err => res.status(400).json(err));
  }
};
