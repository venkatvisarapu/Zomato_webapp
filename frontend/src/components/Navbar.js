import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h2 className="logo">🍽️ TOMATO </h2>
      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        <Link to="/search/location" className={location.pathname === "/search/location" ? "active" : ""}>Nearby Restaurants</Link>
        <Link to="/search/image" className={location.pathname === "/search/image" ? "active" : ""}>Image Search</Link>
      </div>
    </nav>
  );
};

export default Navbar;
