require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

console.log("🚀 Server is starting...");

// Catch and log all errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// Load environment variables from .env file
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:tQDXlCMv0d15vygp@zomatocluster.71ypg.mongodb.net/zomatoDB?retryWrites=true&w=majority&appName=ZomatoCluster";

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI, {})
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for frontend access

// ✅ Log every incoming request
app.use((req, res, next) => {
  console.log(`📢 Request: ${req.method} ${req.url}`);
  next();
});

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Zomato API!");
});

// Import Routes
const restaurantRoutes = require("./routes/restaurantRoutes");
const countryRoutes = require("./routes/countryRoutes");
const imageSearchRoutes = require("./routes/imageSearchRoutes"); // ✅ Add this line

// Use Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/image", imageSearchRoutes); // ✅ Add this line

// 🔥 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Start the Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
