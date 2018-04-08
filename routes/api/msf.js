const router = require('express').Router();
const msfController = require('../../controllers/msfController');

// Matches with "/api/msf/record"
router.route('/record/:season/:team')
  .get(msfController.divRecord);  

// Matches with "/api/msf/game"
router.route('/game/:season/:id')
  .get(msfController.game);

module.exports = router;
