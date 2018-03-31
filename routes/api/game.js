const router = require('express').Router();
const gameController = require('../../controllers/gameController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/game/:id"
router.route('/:id')
  .get(gameController.game);

// Matches with "/api/game/attendance"
router.route('/attendance')
  .post(authCheck(), gameController.create);

// Matches with "/api/game/attendance/:id"
router.route('/attendance/:id')
  .delete(authCheck(), gameController.delete);

module.exports = router;
