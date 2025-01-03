const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  console.log(req.query.search);
  const query = new RegExp(req.query.search, 'i');
  console.log(query);

  const allListing = await Listing.find({title:{$regex:query}});
  console.log(allListing)
  res.render("listings/index.ejs", { allListing });
};

module.exports.newCreateForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const curListing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!curListing) {
    req.flash("error", "The Requested Listing Does Not Exist");
    res.redirect("/listings");
  } else res.render("listings/show.ejs", { curListing });
};

module.exports.listingEditForm = async (req, res) => {
  let { id } = req.params;
  const curListing = await Listing.findById(id);
  if (!curListing) {
    req.flash("error", "The Requested Listing Does Not Exist");
   return res.redirect("/listings");
  } 
   let OriginalImageUrl=curListing.image.url;
   OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/w_200")
   res.render("listings/edit.ejs", { curListing,OriginalImageUrl });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "The Requested Listing Has Been Removed!");
  res.redirect(`/listings`);
};

module.exports.createListing = async (req, res, next) => {
  let { path:url, filename } = req.file;
 console.log(url,filename)
 console.log(req.body);
  
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = res.locals.currUser;
  newlisting.image={filename,url};
  await newlisting.save();
  req.flash("success", "New listing Added SuccessFully!");
  res.redirect("/listings");
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
  }
  req.flash("success", "The Requested Listing Has been Updated!");
  res.redirect(`/listings/${id}`);
};
