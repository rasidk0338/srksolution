const User = require("../models/User");
const nodemailer = require("nodemailer");

// removed OTP imports and functions

exports.getRegister = (req, res) => {
  res.render("register", { message: null });
};

exports.postRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("register", { message: "Email already registered" });
    }

    const user = new User({ name, email, password });
    user.isVerified = true; // auto-verify
    await user.save();

    // auto-login after registration
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
};

// removed resendOtp export

exports.getLogin = (req, res) => {
  res.render("login", { message: null });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { message: "Invalid credentials" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render("login", { message: "Invalid credentials" });
    }
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const redirectTo = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectTo);
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};
