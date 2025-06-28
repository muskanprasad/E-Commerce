import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import '../App.css';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = `http://localhost:5001/api/products/${id}`;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiUrl);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (err.response && err.response.status === 404) {
          toast.error('Product not found.');
        } else if (err.response && err.response.status === 400) {
          toast.error('Invalid product ID.');
        } else {
          toast.error('Failed to load product details. Please try again later.');
        }
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="product-detail-page loading-state">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page no-product-data">
        Product data is not available.
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name} className="detail-image" />
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p className="product-price-detail"><strong>Price:</strong> ₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>
          <p><strong>Stock:</strong> {product.countInStock}</p>
          <p className="product-description-detail"><strong>Description:</strong> {product.description}</p>
          <div className="detail-actions">
            <Link to={`/edit-product/${product._id}`} className="button edit-product-button">Edit Product</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;