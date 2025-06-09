// client/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // <--- Import Link
import axios from 'axios';
import '../App.css';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = `http://localhost:5001/api/products/${id}`;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(apiUrl);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (err.response && err.response.status === 404) {
          setError('Product not found.');
        } else if (err.response && err.response.status === 400) {
          setError('Invalid product ID.');
        } else {
          setError('Failed to load product details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, apiUrl]);

  if (loading) {
    return <div className="product-detail-page">Loading product...</div>;
  }

  if (error) {
    return <div className="product-detail-page error-message">{error}</div>;
  }

  if (!product) {
    return <div className="product-detail-page">Product data is not available.</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        <img src={product.imageUrl} alt={product.name} className="detail-image" />
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Stock:</strong> {product.countInStock}</p>
          <p><strong>Description:</strong> {product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;