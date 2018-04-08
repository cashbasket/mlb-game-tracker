const router = require('express').Router();
const teamRoutes = require('./team');
const gameRoutes = require('./game');
const scheduleRoutes = require('./schedule');
const dashboardRoutes = require('./dashboard');
const profileRoutes = require('./profile');
const adminRoutes = require('./admin');
const msfRoutes = require('./msf');
const authRoutes = require('./auth');

// mlb schedule routes
router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/game', gameRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);
router.use('/msf', msfRoutes);

module.exports = router;
