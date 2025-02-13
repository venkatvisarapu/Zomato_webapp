const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  RestaurantId: Number,
  Name: String,
  Cuisines: String,
  AverageCost: Number,
  Currency: String,
  Rating: Number,
  Votes: Number,
  Location: {
    Address: String,
    City: String,
    Latitude: Number,
    Longitude: Number
  },
  HasOnlineDelivery: Boolean,
  HasTableBooking: Boolean,
  PriceRange: Number,
  FeaturedImage: String,
  MenuURL: String,
  PhotosURL: String,
  ZomatoEvents: [
    {
      EventID: Number,
      Title: String,
      Description: String,
      StartDate: String,
      EndDate: String,
      Photos: [String]
    }
  ]
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);