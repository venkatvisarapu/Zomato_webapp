import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RestaurantList from "./pages/RestaurantList";
import RestaurantDetail from "./pages/RestaurantDetail";
import LocationSearch from "./pages/LocationSearch";
import ImageSearch from "./pages/ImageSearch";
import "./styles.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/search/location" element={<LocationSearch />} />
          <Route path="/search/image" element={<ImageSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
