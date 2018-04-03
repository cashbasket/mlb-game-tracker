const passport = require('passport');

module.exports = {
  // Return data for single team

  authenticate: (req, res, next) => {
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
  },

  register: (req, res, next) => {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return res.json(info);
      }
      res.status(200).json(user);
    })(req, res, next);
  },

  login: (req, res, next) => {
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
          res.status(200).json(user);
        });
      });
    })(req, res, next);
  },

  logout: (req, res, next) => {
    req.logout();
    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).send('OK');
    });
  }
};