const router = require('express').Router();
const scheduleController = require('../../controllers/scheduleController');

// Matches with "/api/schedule/:id"
router.route('/:id')
  .get(scheduleController.findAll);
//.post(scheduleController.create);

// Matches with "/api/articles/:id"
// router.route("/:id")
//   .delete(scheduleController.remove);

module.exports = router;
