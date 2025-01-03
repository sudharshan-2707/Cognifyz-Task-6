const User=require("../models/user.js")

module.exports.renderSignUp=(req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({
        email: email,
        username: username,
      });
      let registredUser = await User.register(newUser, password);
      req.login(registredUser,(err)=>{
        if(err)return next(err);
        req.flash("success", "You Have SuccessFully Signed Up");
        res.redirect("/listings");
      })
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  }

  module.exports.renerLogIn=(req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.logIn=async (req, res) => {
    req.flash("success","Welcome To Wanderful")
     let redirectUrl=res.locals.redirectUrl||"/listings"
     res.redirect(redirectUrl)
  };

  module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
      if(err)return next(err);
      req.flash("success","you are logged out")
      res.redirect("/listings")
    })
  };