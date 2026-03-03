// auth middleware

exports.ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user && req.session.user._id) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  return res.redirect("/login");
};

exports.ensureRole = (role) => (req, res, next) => {
  if (req.session.user && req.session.user.role === role) {
    return next();
  }
  return res.status(403).send("Forbidden");
};
