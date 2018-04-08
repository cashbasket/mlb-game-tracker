const db = require('../models');

// Defining methods for the teamController
module.exports = {
  // Return data for single team
  team: function(req, res) {
    db.team.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.venue,
        required: true
      }]
    })
      .then(dbTeam => res.json({
        team: dbTeam
      }))
      .catch(err => res.status(400).json(err));
  },

  // Return list of teams
  teams: function(req, res) {
    db.team.findAll({
      order: [
        [ 'city', 'ASC' ],
        [ 'name', 'ASC' ]
      ]
    })
      .then(dbTeam => res.json({
        teams: dbTeam
      }))
      .catch(err => res.status(400).json(err));
  }
};
