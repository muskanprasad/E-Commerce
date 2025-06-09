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

  // NEW: Debounced states for price inputs
  const [debouncedMinPrice, setDebouncedMinPrice] = useState('');
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('');

  // States for dynamically fetched categories and brands for filters
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [fetchedBrands, setFetchedBrands] = useState([]);

  const apiUrl = 'http://localhost:5001/api/products';

  // OLD useEffect for fetching products (will be modified slightly)
  useEffect(() => {
    fetchProducts();
    // NOW DEPENDS ON DEBOUNCED PRICE STATES
  }, [searchTerm, selectedCategory, debouncedMinPrice, debouncedMaxPrice, selectedBrand]); // <-- UPDATED DEPENDENCIES

  // NEW: Debounce useEffect for minPrice
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
    }, 500); // 500ms delay

    // Cleanup function: This runs if minPrice changes before the timeout
    // or if the component unmounts. It clears the previous timeout.
    return () => {
      clearTimeout(handler);
    };
  }, [minPrice]); // This effect only runs when minPrice changes

  // NEW: Debounce useEffect for maxPrice
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
    }, 500); // 500ms delay

    // Cleanup function
    return () => {
      clearTimeout(handler);
    };
  }, [maxPrice]); // This effect only runs when maxPrice changes


  // useEffect to fetch dynamic categories and brands for the filter dropdowns on initial load
  useEffect(() => {
    const fetchDynamicFilters = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/categories'),
          axios.get('http://localhost:5001/api/brands')
        ]);
        setFetchedCategories(categoriesRes.data.categories);
        setFetchedBrands(brandsRes.data.brands);
      } catch (err) {
        console.error('Error fetching dynamic categories/brands for filters:', err);
        // Optionally set a message for the user if filter options fail to load
      }
    };
    fetchDynamicFilters();
  }, []); // Empty dependency array means this runs only once on component mount


  const fetchProducts = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const params = {};
      if (searchTerm) params.name = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      // NOW USE DEBOUNCED PRICE STATES FOR THE API CALL
      if (debouncedMinPrice) params.minPrice = debouncedMinPrice;
      if (debouncedMaxPrice) params.maxPrice = debouncedMaxPrice;
      if (selectedBrand) params.brand = selectedBrand;

      // Debugging: Log the parameters being sent
      console.log("Fetching products with params:", params);

      const response = await axios.get(apiUrl, { params });

      // Debugging: Log the full response data
      console.log("API Response Data:", response.data);

      // Ensure that response.data.products exists and is an array
      if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        // If data structure is unexpected, treat as empty
        console.warn("API response.data.products was not an array or was missing:", response.data);
        setProducts([]);
      }

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
    // The debounced states will also clear themselves via their useEffects
    // as minPrice/maxPrice become empty strings.
  };

  // Conditional rendering for loading and error states
  if (loading) {
    return <div className="product-listing-page"><p>Loading products...</p></div>;
  }

  if (error) {
    return <div className="product-listing-page error-message"><p>{error}</p></div>;
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
              {/* Use dynamically fetched categories here */}
              {fetchedCategories.map((cat) => (
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
              {/* Use dynamically fetched brands here */}
              {fetchedBrands.map((brand) => (
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
              onChange={(e) => setMinPrice(e.target.value)} // This still updates on every keystroke
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price:</label>
            <input
              type="number"
              id="maxPrice"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)} // This still updates on every keystroke
            />
          </div>

          <button onClick={handleClearFilters} className="clear-filters-button">
            Clear Filters
          </button>
        </div>

        <div className="product-content">
          {products.length === 0 ? (
            <p className="no-products-message">No products found matching your criteria.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="product-card-link">
                  <div className="product-card">
                    <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      {/* Format price to two decimal places */}
                      <p className="product-price">${product.price ? product.price.toFixed(2) : 'N/A'}</p>
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