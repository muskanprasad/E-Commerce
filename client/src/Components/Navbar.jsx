// client/src/components/Navbar.jsx (Example)
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Make sure this import is there!

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ShopSphere
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/products" className="nav-links">
              Browse Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/seller-dashboard" className="nav-links">
              Seller Dashboard
            </Link>
          </li>
          {/* Add more nav items here if needed */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;