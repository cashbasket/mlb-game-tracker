const router = require('express').Router();
const dashboardController = require('../../controllers/dashboardController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/dashboard/gamesattended"
router.route('/gamesattended/:userId')
  .get(authCheck(), dashboardController.gamesAttended);

// Matches with "/api/dashboard/postscount"
router.route('/postscount/:userId')
  .get(authCheck(), dashboardController.postsCount);

// Matches with "/api/dashboard/ballparkcount"
router.route('/ballparkcount/:userId')
  .get(authCheck(), dashboardController.ballparkCount);

// Matches with "/api/dashboard/user"
router.route('/user/:username')
  .get(authCheck(), dashboardController.user);

// Matches with "/api/dashboard/wins"
router.route('/wins/:userId')
  .get(authCheck(), dashboardController.wins);

// Matches with "/api/dashboard/losses"
router.route('/losses/:userId')
  .get(authCheck(), dashboardController.losses);
  
// Matches with "/api/dashboard/last"
router.route('/last/:userId')
  .get(authCheck(), dashboardController.last);
  
// Matches with "/api/dashboard/upcoming"
router.route('/upcoming/:userId')
  .get(authCheck(), dashboardController.upcoming);

// Matches with "/api/dashboard/recentposts"
router.route('/recentposts/:userId')
  .get(dashboardController.recentPosts);

module.exports = router;
