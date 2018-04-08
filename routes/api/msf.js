const router = require('express').Router();
const msfController = require('../../controllers/msfController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/msf/record"
router.route('/record/:season/:team')
  .get(msfController.divRecord);  

// Matches with "/api/msf/game"
router.route('/game/:season/:id')
  .get(msfController.game);

// Matches with "/api/msf/update"
router.route('/update')
  .get(authCheck(), msfController.update);

module.exports = router;
