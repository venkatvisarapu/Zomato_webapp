const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

router.get("/search", async (req, res) => {
  try {
    const { name, country, cuisines } = req.query;
    let filter = {};

    if (name) {
      filter.Name = { $regex: name, $options: "i" };
    }
    if (country) {
      filter["Location.City"] = { $regex: country, $options: "i" };
    }
    if (cuisines) {
      filter.Cuisines = { $regex: cuisines, $options: "i" };
    }

    const restaurants = await Restaurant.find(filter);
    res.json({ total: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ 1️⃣ Find Nearby Restaurants First (before :id)
router.get("/nearby", async (req, res) => {
  console.log("🟢 Received request to /nearby API");

  try {
    const { lat, lng, range } = req.query;

    if (!lat || !lng || !range) {
      console.log("🔴 Missing required parameters");
      return res.status(400).json({ error: "Please provide latitude, longitude, and range." });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxDistance = parseFloat(range) * 1000; // Convert km to meters

    console.log(`🔍 Searching for restaurants near Lat: ${userLat}, Lng: ${userLng}, Range: ${range} km`);

    const restaurants = await Restaurant.find({
      "Location.Latitude": { $exists: true, $ne: null, $gte: userLat - 0.1, $lte: userLat + 0.1 },
      "Location.Longitude": { $exists: true, $ne: null, $gte: userLng - 0.1, $lte: userLng + 0.1 }
    });

    console.log(`✅ Found ${restaurants.length} restaurants`);
    res.json(restaurants);
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// ✅ 2️⃣ Get List of Restaurants with Pagination
router.get("/", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find().skip(skip).limit(limit);
    const totalRestaurants = await Restaurant.countDocuments();

    res.json({
      totalRestaurants,
      page,
      totalPages: Math.ceil(totalRestaurants / limit),
      restaurants
    });
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ 3️⃣ Get Restaurant by ID (Now it's Last)
router.get("/:id", async (req, res) => {
  try {
    console.log(`📌 Fetching restaurant with ID: ${req.params.id}`);

    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Invalid Restaurant ID. It should be a number." });
    }

    const restaurant = await Restaurant.findOne({ RestaurantId: req.params.id });

    if (!restaurant) {
      console.log("🔴 Restaurant not found!");
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("❌ Error fetching restaurant by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;