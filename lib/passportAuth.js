module.exports = function() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      req.session.touch();
      return next();
    }
    res.redirect('/login');
  };
};