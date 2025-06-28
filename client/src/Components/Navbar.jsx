import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          ShopSphere
        </Link>

        {/* This div will be your hamburger menu icon on smaller screens */}
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/products" className="nav-links" onClick={closeMobileMenu}>
              Browse Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/seller-dashboard" className="nav-links" onClick={closeMobileMenu}>
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