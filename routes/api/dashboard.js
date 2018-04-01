const router = require('express').Router();
const dashboardController = require('../../controllers/dashboardController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/dashboard/gamesattended"
router.route('/gamesattended')
  .get(authCheck(), dashboardController.gamesAttended);

// Matches with "/api/dashboard/postscount"
router.route('/postscount')
  .get(authCheck(), dashboardController.postsCount);

// Matches with "/api/dashboard/ballparkcount"
router.route('/ballparkcount')
  .get(authCheck(), dashboardController.ballparkCount);

// Matches with "/api/dashboard/wins"
router.route('/wins')
  .get(authCheck(), dashboardController.wins);

// Matches with "/api/dashboard/losses"
router.route('/losses')
  .get(authCheck(), dashboardController.losses);
  
// Matches with "/api/dashboard/last"
router.route('/last')
  .get(authCheck(), dashboardController.last);
  
// Matches with "/api/dashboard/upcoming"
router.route('/upcoming')
  .get(authCheck(), dashboardController.upcoming);

// Matches with "/api/dashboard/recentposts"
router.route('/recentposts')
  .get(authCheck(), dashboardController.recentPosts);

module.exports = router;
