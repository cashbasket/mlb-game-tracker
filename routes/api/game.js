const router = require('express').Router();
const gameController = require('../../controllers/gameController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/game/:id"
router.route('/:id')
  .get(gameController.game);

// Matches with "/api/game/attendance"
router.route('/attendance')
  .post(authCheck(), gameController.createAtt);

// Matches with "/api/game/attendance/:id"
router.route('/attendance/:id')
  .delete(authCheck(), gameController.deleteAtt);

// Matches with "/api/game/posts/:id"
router.route('/posts/:id')
  .get(gameController.posts);
  
// Matches with "/api/game/posts/:id"
router.route('/posts')
  .post(authCheck(), gameController.createPost);

// Matches with "/api/game/posts/:id"
router.route('/posts/:id')
  .delete(authCheck(), gameController.deletePost);  

module.exports = router;
