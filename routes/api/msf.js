const router = require('express').Router();
const msfController = require('../../controllers/msfController');

// Matches with "/api/teams"
router.route('/record')
  .get(msfController.divRecord);  

module.exports = router;
