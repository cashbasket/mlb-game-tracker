const router = require('express').Router();
const gameController = require('../../controllers/gameController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/game/:id"
router.route('/:id')
  .get(gameController.game);

// Matches with "/api/game/attendance"
router.route('/attendance/:id?')
  .get(gameController.attendees)
  .post(authCheck(), gameController.createAtt)
  .delete(authCheck(), gameController.deleteAtt);

// Matches with "/api/game/posts/:id"
router.route('/posts/:id')
  .get(gameController.posts);
  
// Matches with "/api/game/posts/:id"
router.route('/posts')
  .post(authCheck(), gameController.createPost);

// Matches with "/api/game/posts/:id"
router.route('/posts/:id')
  .put(authCheck(), gameController.updatePost)
  .delete(authCheck(), gameController.deletePost);  

// Matches with "/api/game/posts/:id/comments"
router.route('/posts/:id/comments')
  .get(gameController.comments);

// Matches with "/api/game/posts/comments"
router.route('/posts/comments')
  .post(authCheck(), gameController.createComment);

// Matches with "/api/game/posts/comments/:id"
router.route('/posts/comments/:id')
  .put(authCheck(), gameController.updateComment)
  .delete(authCheck(), gameController.deleteComment);

module.exports = router;
