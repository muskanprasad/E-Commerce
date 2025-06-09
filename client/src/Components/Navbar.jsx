// client/src/components/Navbar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <nav className="navbar"> {/* This 'nav' element gets the main dark background */}
      <div className="navbar-container"> {/* This 'div' controls internal layout */}
        <Link to="/" className="navbar-brand">
          <h1>ShopSphere</h1> {/* Your app name */}
        </Link>
        <ul className="nav-links"> {/* These are your navigation links */}
          <li>
            <Link to="/" className={isActive('/')}>
              Browse Products
            </Link>
          </li>
          <li>
            <Link to="/seller-dashboard" className={isActive('/seller-dashboard')}>
              Seller Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;