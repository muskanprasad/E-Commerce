import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';
import './ProductListingPage.css';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  const apiUrl = 'http://localhost:5001/api/products';

  const categories = [
    'Electronics', 'Books', 'Home & Kitchen', 'Footwear', 'Sports & Outdoors', 'Home & Office'
  ];
  const brands = [
    'Acer', 'Sony', 'Herman Miller', 'Apple', 'Nike',
    'Keurig', 'Canon', 'Lululemon', 'JBL', 'T-fal'
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, minPrice, maxPrice, selectedBrand]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchTerm) params.name = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedBrand) params.brand = selectedBrand;

      const response = await axios.get(apiUrl, { params });
      setProducts(response.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('');
  };

  if (loading) {
    return <div className="product-listing-page">Loading products...</div>;
  }

  if (error) {
    return <div className="product-listing-page error-message">{error}</div>;
  }

  return (
    <div className="product-listing-page">
      <h1>Browse Products</h1>

      <div className="main-content-area">

        <div className="filter-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label htmlFor="searchName">Search by name:</label>
            <input
              type="text"
              id="searchName"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="categoryFilter">Category:</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="brandFilter">Brand:</label>
            <select
              id="brandFilter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="minPrice">Min Price:</label>
            <input
              type="number"
              id="minPrice"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price:</label>
            <input
              type="number"
              id="maxPrice"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <button onClick={handleClearFilters} className="clear-filters-button">
            Clear Filters
          </button>
        </div>

        <div className="product-content">
          {products.length === 0 ? (
            <p>No products found matching your criteria.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="product-card-link">
                  <div className="product-card">
                    <img src={product.imageUrl} alt={product.name} />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-price">${product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductListingPage;