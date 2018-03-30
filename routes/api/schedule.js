const router = require('express').Router();
const scheduleController = require('../../controllers/scheduleController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/schedule/:id"
router.route('/:id')
  .get(authCheck(), scheduleController.schedule);

module.exports = router;
