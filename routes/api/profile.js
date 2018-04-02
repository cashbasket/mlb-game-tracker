const router = require('express').Router();
const profileController = require('../../controllers/profileController');
const authCheck = require('../../lib/passportAuth');

// Matches with "/api/profile/:id"
router.route('/:id')
  .get(profileController.profile);

// Matches with "/api/profile/:id"
router.route('/:id')
  .put(authCheck(), profileController.updateProfile);

// Matches with "/api/profile/past/:id"
router.route('/past/:id')
  .get(profileController.pastGames);

// Matches with "/api/profile/upcoming/:id"
router.route('/upcoming/:id')
.get(profileController.upcomingGames);

module.exports = router;
