require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const ledgerRoutes = require("./routes/ledger");
const { ensureAuthenticated } = require("./middleware/auth");
const { globalErrorHandler } = require("./middleware/errorHandler");

const app = express();

// database
connectDB();

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

// locals for templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

// routes
app.use("/", authRoutes);
app.use("/ledger", ensureAuthenticated, ledgerRoutes);

// home
app.get("/", ensureAuthenticated, (req, res) => {
  res.redirect("/ledger");
});

// error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
