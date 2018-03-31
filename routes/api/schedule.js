const router = require('express').Router();
const scheduleController = require('../../controllers/scheduleController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/schedule/:id"
router.route('/:id')
  .get(scheduleController.schedule);

module.exports = router;
