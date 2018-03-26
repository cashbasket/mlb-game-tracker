const router = require('express').Router();
const scheduleRoutes = require('./schedule');

// mlb schedule routes
router.use('/schedule', scheduleRoutes);

module.exports = router;
