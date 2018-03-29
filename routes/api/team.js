const router = require('express').Router();
const teamController = require('../../controllers/teamController');

// Matches with "/api/teams"
router.route('/teams')
  .get(teamController.teams);

// Matches with "/api/teams/:id"
router.route('/teams/:id')
  .get(teamController.team);  

// Matches with "/api/schedule/:id"
router.route('/schedule/:id')
  .get(teamController.teamSchedule);

module.exports = router;
