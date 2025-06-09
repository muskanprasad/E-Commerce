import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [products, setProducts] = useState([]);
  const [fetchError, setFetchError] = useState('');

  const apiUrl = 'http://localhost:5001/api/products';

  const categories = [
    'Electronics', 'Home & Office', 'Footwear', 'Sports & Outdoors', 'Home & Kitchen'
  ];
  const brands = [
    'Acer', 'Sony', 'Herman Miller', 'Apple', 'Nike',
    'Keurig', 'Canon', 'Lululemon', 'JBL', 'T-fal'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setFetchError('');
    try {
      const response = await axios.get(apiUrl);
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products for seller dashboard:', err);
      setFetchError('Failed to load products for management.');
      setProducts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!productName || !description || !price || !category || !brand) {
      setError('Please fill in all required fields for adding a product.');
      return;
    }

    try {
      const newProduct = {
        name: productName,
        description,
        price: parseFloat(price),
        category,
        brand,
        imageUrl,
        countInStock: 10,
      };

      const response = await axios.post(apiUrl, newProduct);

      setMessage(`Product "${response.data.product.name}" added successfully!`);
      setProductName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setBrand('');
      setImageUrl('');

      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err.response ? err.response.data : err.message);
      setError(`Error adding product: ${err.response ? err.response.data.message : err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`${apiUrl}/${id}`);s
        setMessage(response.data.message || 'Product deleted successfully!'); // Set success message
        setError(''); // Clear any previous errors
        fetchProducts(); // Refresh the product list after deletion
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.response?.data?.message || 'Error deleting product.'); // Set error message
        setMessage(''); // Clear any previous success messages
      }
    }
  };

  return (
    <div className="seller-dashboard-container">
      <h1>Seller Dashboard</h1>

      <section className="create-product-section">
        <h2>List a New Product</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="brand">Brand:</label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL:</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g., https://example.com/image.jpg"
            />
          </div>
          <button type="submit" className="submit-button">Add Product</button>
        </form>
      </section>

      <section className="manage-products-section">
        <h2>Manage Your Products</h2>
        {fetchError && <p className="error-message">{fetchError}</p>}
        {products.length === 0 ? (
          <p>No products to manage. Add some using the form above!</p>
        ) : (
          <ul className="product-management-list">
            {products.map((product) => (
              <li key={product._id} className="product-management-item">
                <span className="product-name">{product.name}</span>
                <div className="product-actions">
                  <Link to={`/edit-product/${product._id}`} className="button edit-button">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="button delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default SellerDashboard;