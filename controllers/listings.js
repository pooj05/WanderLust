const Listing = require("../models/listing.js");
const { geocoding } = require('@maptiler/client');
const mapToken = process.env.MAP_TOKEN;

module.exports.index = async (req,res) => {
    let allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};
module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested doesn't exist....");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing,mapToken});

};
module.exports.createListing = async(req,res,next) => {

    try {
    const location = req.body.listing.location;

    const response = await geocoding.forward(location, { limit: 1 , apiKey: mapToken,});
    const geoFeature = response.features[0];

    if (!geoFeature) {
      req.flash("error", "Could not geocode location.");
      return res.redirect("/listings/new");
    }

    const [lng, lat] = geoFeature.geometry.coordinates;
    
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"...",filename);
    const newListing = new Listing(req.body.listing);
    console.log(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    // 🌍 Save GeoJSON format
    newListing.geometry = {
      type: "Point",
      coordinates: [lng, lat]
    };
    await newListing.save();
    req.flash("success","New Listing Created!");
    return res.redirect("/listings");
   
}
catch (err) {
    console.error("Create Listing Error:", err);
    req.flash("error", "An error occurred.");
    res.redirect("/listings/new");
  }
};
module.exports.editListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested doesn't exist....");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250/");
    res.render("listings/edit.ejs",{listing});
};
module.exports.updateListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    
     req.flash("success"," Listing Updated!");
     res.redirect(`/listings/${id}`);
     
};
module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deletedata = await Listing.findByIdAndDelete(id);
    console.log(deletedata);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
};