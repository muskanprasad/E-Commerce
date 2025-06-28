import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../App.css';
import './EditProductPage.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    imageUrl: '',
    countInStock: '',
  });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const apiUrl = `http://localhost:5001/api/products/${id}`;

  useEffect(() => {
    const fetchProductAndFilters = async () => {
      setLoading(true);
      try {
        const productRes = await axios.get(apiUrl);
        setFormData({
          name: productRes.data.name || '',
          description: productRes.data.description || '',
          price: productRes.data.price || '',
          category: productRes.data.category || '',
          brand: productRes.data.brand || '',
          imageUrl: productRes.data.imageUrl || '',
          countInStock: productRes.data.countInStock || 0,
        });

        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/categories'),
          axios.get('http://localhost:5001/api/brands')
        ]);
        setCategories(categoriesRes.data.categories);
        setBrands(brandsRes.data.brands);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching product data or filters for edit:', err);
        toast.error('Failed to load product or categories/brands. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProductAndFilters();
    }
  }, [id, apiUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(apiUrl, {
        ...formData,
        price: parseFloat(formData.price),
        countInStock: parseInt(formData.countInStock, 10),
      });
      toast.success(response.data.message || 'Product updated successfully!');
      navigate(`/product/${id}`);
    } catch (err) {
      console.error('Error updating product:', err.response ? err.response.data : err.message);
      toast.error(err.response?.data?.message || 'Error updating product.');
    }
  };

  if (loading) {
    return <div className="edit-product-page loading-state">Loading product data...</div>;
  }

  return (
    <div className="edit-product-page">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} className="product-edit-form">
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
          <input
            type="text"
            id="category"
            name="category"
            list="categories-list"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <datalist id="categories-list">
            {categories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand:</label>
          <input
            type="text"
            id="brand"
            name="brand"
            list="brands-list"
            value={formData.brand}
            onChange={handleChange}
            required
          />
          <datalist id="brands-list">
            {brands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
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

        <div className="form-actions">
          <button type="submit" className="button submit-button">Update Product</button>
          <button type="button" onClick={() => navigate(-1)} className="button cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;