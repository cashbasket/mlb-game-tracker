const router = require('express').Router();
const gameController = require('../../controllers/gameController');

// Matches with "/api/game/:id"
router.route('/:id')
  .get(gameController.game);

// Matches with "/api/game/attendance"
router.route('/attendance')
  .post(gameController.create);

// Matches with "/api/game/attendance/:id"
router.route('/attendance/:id')
  .delete(gameController.create);

module.exports = router;
