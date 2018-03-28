const db = require('../models');
const Op = db.Sequelize.Op;
const moment = require('moment');

// Defining methods for the scheduleController
module.exports = {
  findAll: function(req, res) {
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
        where: { userId: req.query.user }
      }],
      order: [
        ['gameDate', 'ASC'],
        ['gameTime', 'ASC'],
      ]
    })
      .then(dbGame => res.json(dbGame))
      .catch(err => res.status(400).json(err));
  }
};
