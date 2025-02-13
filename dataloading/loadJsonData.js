const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();  // Load MongoDB URI from .env file

const Restaurant = require("./models/Restaurant");

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://admin:tQDXlCMv0d15vygp@zomatocluster.71ypg.mongodb.net/zomatoDB?retryWrites=true&w=majority&appName=ZomatoCluster";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// List all JSON files to process
const jsonFiles = ["file1.json", "file2.json", "file3.json", "file4.json", "file5.json"];

// Function to load and insert data from all files
const loadAllFiles = async () => {
  try {
    let allData = [];

    for (let file of jsonFiles) {
      console.log(`📂 Processing ${file}...`);
      const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));

      rawData.forEach((entry) => {
        if (entry.restaurants) {
          const jsonData = entry.restaurants.map(r => ({
            RestaurantId: r.restaurant.R.res_id,
            Name: r.restaurant.name || "Unknown",
            Cuisines: r.restaurant.cuisines || "Not Specified",
            AverageCost: r.restaurant.average_cost_for_two || 0,
            Currency: r.restaurant.currency || "Unknown",
            Rating: parseFloat(r.restaurant.user_rating?.aggregate_rating) || 0,
            Votes: parseInt(r.restaurant.user_rating?.votes) || 0,
            Location: {
              Address: r.restaurant.location?.address || "No Address",
              City: r.restaurant.location?.city || "Unknown City",
              Latitude: parseFloat(r.restaurant.location?.latitude) || 0,
              Longitude: parseFloat(r.restaurant.location?.longitude) || 0
            },
            HasOnlineDelivery: r.restaurant.has_online_delivery === 1,  // Convert 1/0 to true/false
            HasTableBooking: r.restaurant.has_table_booking === 1,
            PriceRange: r.restaurant.price_range || 0,
            FeaturedImage: r.restaurant.featured_image || "https://via.placeholder.com/150",
            MenuURL: r.restaurant.menu_url || "#",
            PhotosURL: r.restaurant.photos_url || "#",
            ZomatoEvents: r.restaurant.zomato_events ? r.restaurant.zomato_events.map(e => ({
              EventID: e.event.event_id,
              Title: e.event.title,
              Description: e.event.description,
              StartDate: e.event.start_date,
              EndDate: e.event.end_date,
              Photos: e.event.photos?.map(p => p.photo.url) || []
            })) : []
          }));

          allData = allData.concat(jsonData);
        }
      });
    }

    // Insert all data into MongoDB
    await Restaurant.insertMany(allData);
    console.log(`✅ Successfully Inserted ${allData.length} Restaurants!`);
  } catch (err) {
    console.error("❌ Data Insertion Error:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
loadAllFiles();
