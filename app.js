if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const sequelize = require("./db"); // Assuming db.js exports the sequelize instance
const User = require("./models/user"); // Sequelize User model
const Listing = require("./models/listing"); // Sequelize Listing model
const Review = require("./models/review"); // Sequelize Review model

const ExpressError = require("./utils/ExpressError.js");
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const app = express();
const port = 3000;

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connection is Established To DataBase");
  } catch (err) {
    console.log("Unable to connect to the database:", err);
  }
}

main();

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy for Authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// index route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.MAP_KEY = process.env.MAP_KEY;
  next();
});

// Routers
app.use("/listings", listingsRoute);
app.use("/listings/:listing_id/reviews", reviewsRoute);
app.use("/", userRoute);

// Page Not Found Route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// Starting The Server
app.listen(port, () => {
  console.log(`Listening to port:${port}`);
});
