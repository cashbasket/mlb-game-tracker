const router = require('express').Router();
const gameController = require('../../controllers/gameController');

// Matches with "/api/game/:id"
router.route('/game/:id')
  .get(gameController.game);

router.route('/attendance')
  .post(gameController.create);
  
router.route('/attendance/:id')
  .post(gameController.create);

module.exports = router;
