const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const authController = require('../../controllers/authController');

const loginLimiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 10,
  delayMs: 0, // disabled
  message: 'Too many logins from this IP address. Please try again in 15 minutes.'
});

const createAccountLimiter = new RateLimit({
  windowMs: 60*60*1000,
  delayAfter: 1,
  delayMs: 1000,
  max: 5,
  message: 'Too many accounts created from this IP address. Please try again after an hour'
});

router.route('/authenticate')
  .get(authController.authenticate);

router.route('/register')
  .post(createAccountLimiter, authController.register);

router.route('/login')
  .post(loginLimiter, authController.login);

router.route('/logout')
  .post(authController.logout);

module.exports = router;