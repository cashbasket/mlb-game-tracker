const passport = require('passport');
const db = require('../models');
const bcrypt = require('bcrypt-nodejs');

module.exports = {
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

  account: (req, res) => {
    const userId = req.user ? req.user.id : null;
    db.user.findOne({
      where: {
        id: userId
      },
      attributes: { 
        exclude: ['token', 'tokenExpires']
      }
    }).then(dbAccount => res.json({
      user: dbAccount
    }))
      .catch(err => res.status(400).json(err));
  },

  update: (req, res) => {
    const userId = req.user ? req.user.id : null;
    db.user.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if(user && user.email === req.body.email && user.id !== req.user.id)
        return res.json({message: 'That email address is already in use.'});
      return db.user.update({
        email: req.body.email,
        description: req.body.description,
        teamId: req.body.favoriteTeam
      }, {
        where: {
          id: userId
        }
      });
    }).then(user => {
      if(req.body.password.length) {
        return db.user.update({
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null, true),
        }, {
          where: {
            id: userId
          }
        });
      } else {
        return res.status(200).json(user);
      }
    }).then(user => {
      res.status(200).json(user);
    }).catch(err => res.status(400).json(err));
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