import React, { useState } from "react";
import axios from "axios";
import "../styles.css";

const ImageSearch = () => {
  const [file, setFile] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [detectedFoods, setDetectedFoods] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const searchByImage = async () => {
    if (!file) {
      setError("⚠️ Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("foodImage", file);

    try {
      const response = await axios.post("https://zomato-webapp-qtqr.onrender.com/api/image/search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDetectedFoods(response.data.detectedFoods);
      setRestaurants(response.data.restaurants);
    } catch {
      setError("⚠️ No matching food found.");
    }
  };

  return (
    <div className="image-search-container">
      <h2>📸 Find Restaurants by Food Image</h2>

      {error && <p className="error">{error}</p>}

      {/* File Upload */}
      <div className="upload-box">
        <input type="file" onChange={handleFileChange} />
        {file && <img src={URL.createObjectURL(file)} alt="Preview" className="image-preview" />}
      </div>

      <button className="search-button" onClick={searchByImage}>🔍 Search</button>

      {/* Detected Foods */}
      {detectedFoods.length > 0 && (
        <h3 className="detected-foods">🍕 Detected Foods: {detectedFoods.join(", ")}</h3>
      )}

      {/* Restaurant Results */}
      <div className="restaurant-grid">
        {restaurants.length > 0 &&
          restaurants.map((restaurant) => (
            <div key={restaurant.RestaurantId} className="restaurant-card">
              <img src={restaurant.FeaturedImage || "https://via.placeholder.com/150"} alt={restaurant.Name} />
              <h3>{restaurant.Name}</h3>
              <p>🍴 {restaurant.Cuisines}</p>
              <p>⭐ {restaurant.Rating} ({restaurant.Votes} votes)</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageSearch;
