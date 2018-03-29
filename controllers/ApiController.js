var express = require('express');
var router = express.Router();
var models = require('../models');
var RateLimit = require('express-rate-limit');
var crypto = require('crypto');
var passport = require('../config/passport');

router.use(passport.initialize());
router.use(passport.session());

var loginLimiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 10,
  delayMs: 0, // disabled
  message: 'Too many logins from this IP address. Please try again in 15 minutes.'
});

var createAccountLimiter = new RateLimit({
  windowMs: 60*60*1000,
  delayAfter: 1,
  delayMs: 1000,
  max: 5,
  message: 'Too many accounts created from this IP address. Please try again after an hour'
});

router.get('/authenticate', (req, res, next) => {
  if(req.user) {
    return res.status(200).json({
      user: req.user,
      authenticated: true
    });
  } else {
    return res.json({
      authenticated: false
    });
  }
});

router.post('/register', createAccountLimiter, function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    if (!user) {
      return res.json(info);
    }
    res.status(200).json(user);
  })(req, res, next);
});

router.post('/login', loginLimiter, function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      return res.json(info);
    }

    req.login(user, function(err){
      if(err){
        return next(err);
      }
      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ success: true });
      });
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send('OK');
  });
});

module.exports = router;