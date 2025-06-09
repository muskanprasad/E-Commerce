// client/src/pages/EditProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import axios from 'axios';
import '../App.css';
import './EditProductPage.css'; // Optional: create this CSS file

const EditProductPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); // For redirection after update

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    imageUrl: '',
    countInStock: '', // Add countInStock
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const apiUrl = `http://localhost:5001/api/products/${id}`;

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(apiUrl);
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          price: response.data.price || '',
          category: response.data.category || '',
          brand: response.data.brand || '',
          imageUrl: response.data.imageUrl || '',
          countInStock: response.data.countInStock || 0, // Ensure a default if null/undefined
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product data for edit:', err);
        setError('Failed to load product for editing. Please check the ID.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id, apiUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.put(apiUrl, formData);
      setSuccessMessage(response.data.message);
      console.log('Product updated:', response.data.product);
      // Optionally redirect to the product detail page or listing page
      navigate(`/product/${id}`); // Redirect to detail page after update
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || 'Error updating product.');
    }
  };

  if (loading) {
    return <div className="edit-product-page">Loading product data...</div>;
  }

  if (error && !successMessage) { // Display error if present and no success message
    return <div className="edit-product-page error-message">{error}</div>;
  }


  return (
    <div className="edit-product-page">
      <h2>Edit Product</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand:</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="countInStock">Count in Stock:</label>
          <input
            type="number"
            id="countInStock"
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="button submit-button">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductPage;