const db = require('../models');

// Defining methods for the teamController
module.exports = {
  // Return data for single team
  game: function(req, res) {
    const userId = req.user ? req.user.id: null;
    db.game.findOne({
      where: {
        id: req.params.id
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
      }]
    })
      .then(dbGame => res.json({
        game: dbGame
      }))
      .catch(err => res.status(400).json(err));
  },

  // create an attendance record
  create: function(req, res) {
    db.attendance
      .create(req.body)
      .then(dbAttendance => res.json(dbAttendance))
      .catch(err => res.status(400).json(err));
  },

  // delete route for deleting attendance records
  delete: function(req, res) {
    db.attendance.destroy({
      where: {
        userId: req.user.id,
        gameId: req.params.id
      }
    })
      .then(dbAttendance => res.json(dbAttendance))
      .catch(err => res.status(400).json(err));
  }
};
