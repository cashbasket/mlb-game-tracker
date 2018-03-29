const router = require('express').Router();
const teamRoutes = require('./team');
const gameRoutes = require('./game');

// mlb schedule routes
router.use('/', teamRoutes);
router.use('/', gameRoutes);

module.exports = router;
