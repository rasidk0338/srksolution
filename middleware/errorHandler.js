// global error handler

exports.globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status);
  if (req.accepts("html")) {
    res.render("error", { error: err });
  } else if (req.accepts("json")) {
    res.json({ error: err.message });
  } else {
    res.type("txt").send(err.message);
  }
};
