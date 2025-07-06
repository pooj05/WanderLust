const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image:{
        url:String,
        filename: String,
       
    },
    price: {
        
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner :{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
        enum: ["Trending","Rooms","Iconic Cities","Mountains","Amazing pools","Boating","Farms","Arctic","snowboarding"],
    },
 geometry: {
    type: {
      type: String,
      enum: ["Point"], // "geometry.type" must be "Point"
      required:false
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    }
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
//model creation
const Listing = mongoose.model("Listing", listingSchema);
//export model
module.exports = Listing;