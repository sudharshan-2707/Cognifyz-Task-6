const Listing=require("../models/listing.js")
const Review=require("../models/review.js")

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.listing_id);
    let newRev = new Review(req.body.review);
    newRev.author=req.user;
    listing.reviews.push(newRev);
    await newRev.save();
    await listing.save();
    req.flash("success","The Review Has Been Added")
    res.redirect(`/listings/${listing.id}/`);
  }

module.exports.deleteReview=async (req, res) => {
    let { listing_id, review_id } = req.params;
    await Listing.findByIdAndUpdate(listing_id, {
      $pull: { reviews: review_id },
    });
    await Review.findByIdAndDelete(review_id);
    req.flash("success","The Review Has Been Deleted!")
    res.redirect(`/listings/${listing_id}`);
  }