const router = require('express').Router();
const teamController = require('../../controllers/teamController');

// Matches with "/api/teams"
router.route('/')
  .get(teamController.teams);

// Matches with "/api/teams/:id"
router.route('/:id')
  .get(teamController.team);  

module.exports = router;
