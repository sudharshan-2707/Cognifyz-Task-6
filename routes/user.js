const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup", userController.renderSignUp);

router.post("/signup", wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renerLogIn)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.logIn)
  );

router.get("/logout", isLoggedIn, userController.logOut);

module.exports = router;
