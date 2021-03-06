const router = require('express').Router();
const adminController = require('../../controllers/adminController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/admin/game/:id"
router.route('/game/:id')
  .put(authCheck(), adminController.updateGame);

module.exports = router;
