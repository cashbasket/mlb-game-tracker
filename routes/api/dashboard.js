const router = require('express').Router();
const dashboardController = require('../../controllers/dashboardController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/dashboard/gamesattended"
router.route('/gamesattended')
  .get(dashboardController.gamesAttended);

// Matches with "/api/dashboard/postscount"
router.route('/postscount')
  .get(dashboardController.postsCount);

// Matches with "/api/dashboard/ballparkcount"
router.route('/ballparkcount')
  .get(dashboardController.ballparkCount);

// Matches with "/api/dashboard/wins"
router.route('/wins')
  .get(dashboardController.wins);

// Matches with "/api/dashboard/losses"
router.route('/losses')
  .get(dashboardController.losses);
  
// Matches with "/api/dashboard/last"
router.route('/last')
  .get(dashboardController.last);
  
// Matches with "/api/dashboard/upcoming"
router.route('/upcoming')
  .get(dashboardController.upcoming);

// Matches with "/api/dashboard/recentposts"
router.route('/recentposts')
  .get(dashboardController.recentPosts);

module.exports = router;
