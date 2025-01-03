const Listing=require("./models/listing.js")
const Reveiw=require("./models/review.js")
const ExpressError=require("./utils/ExpressError.js")
const { listingSchema,reviewSchema }=require("./Schema.js")
const tt = require('@tomtom-international/web-sdk-services/dist/services-node.min.js');

module.exports.SetCooardinates=async(req,res,next)=>{
  const crdnts= await  tt.services.geocode({
    key: process.env.MAP_KEY,
    query:req.body.listing.location,
    bestResult:true
  })
 req.body.listing.position=crdnts.position;
 next();
}

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       req.session.redirectUrl=req.originalUrl;
       req.flash("error","You Dont Have Permission")
       return res.redirect("/login")
     };
     next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
     res.locals.redirectUrl=req.session.redirectUrl;
   };
   next();
}

module.exports.isOwner=async(req,res,next)=>{
  let { id } = req.params;
  let curListing=await Listing.findById(id);
  if(!req.user._id.equals(curListing.owner._id)){
    req.flash("error","You are Not The Owner of This Listing")
    return res.redirect(`/listings/${id}`)
  }
  next()
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else next();
};

module.exports.isAuthor=async(req,res,next)=>{
  let { listing_id,review_id } = req.params;
  let curRev=await Reveiw.findById(review_id);
  if(!req.user._id.equals(curRev.author._id)){
    req.flash("error","You are Not The Author of Review")
    return res.redirect(`/listings/${listing_id}`)
  }
  next()
}

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else next();
};