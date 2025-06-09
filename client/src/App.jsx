// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductListingPage from './Pages/ProductListingPage'; 
import SellerDashboard from './Pages/SellerDashboard';   
import Navbar from './Components/Navbar';                 
import ProductDetailPage from './Pages/ProductDetailPage';
import EditProductPage from './Pages/EditProductPage';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;