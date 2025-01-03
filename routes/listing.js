const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing,SetCooardinates} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const{ cloudinary , storage }=require("../cloudConfig.js")

const multer=require("multer")
const upload=multer({storage:storage})

const router = express.Router();

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(SetCooardinates),
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.newCreateForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(SetCooardinates),
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.listingEditForm)
);

module.exports = router;
