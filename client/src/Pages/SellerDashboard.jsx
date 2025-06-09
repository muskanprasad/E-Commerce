import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);

  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [fetchedBrands, setFetchedBrands] = useState([]);

  const apiUrl = 'http://localhost:5001/api/products';

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const productsRes = await axios.get(apiUrl);
        setProducts(productsRes.data.products || []);

        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/categories'),
          axios.get('http://localhost:5001/api/brands')
        ]);
        setFetchedCategories(categoriesRes.data.categories);
        setFetchedBrands(brandsRes.data.brands);

      } catch (err) {
        console.error('Error fetching initial data:', err);
        setFetchError('Failed to load products or filter options. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const refreshProducts = async () => {
      try {
        const response = await axios.get(apiUrl);
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Error re-fetching products after operation:', err);
      }
    };

    if (message || error) {
      refreshProducts();
    }
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!productName || !description || !price || !category || !brand) {
      setError('Please fill in all required fields.');
      return;
    }

    const productData = {
      name: productName,
      description,
      price: parseFloat(price),
      category,
      brand,
      imageUrl,
      countInStock: 10,
    };

    try {
      let response;
      if (editingProduct) {
        response = await axios.put(`${apiUrl}/${editingProduct._id}`, productData);
        setMessage(`Product "${response.data.product.name}" updated successfully!`);
      } else {
        response = await axios.post(apiUrl, productData);
        setMessage(`Product "${response.data.product.name}" added successfully!`);
      }

      setProductName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setBrand('');
      setImageUrl('');
      setEditingProduct(null);

    } catch (err) {
      console.error('Error submitting product:', err.response ? err.response.data : err.message);
      setError(`Error submitting product: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setMessage('');
      setError('');
      try {
        const response = await axios.delete(`${apiUrl}/${id}`);
        setMessage(response.data.message || 'Product deleted successfully!');
      } catch (err) {
        console.error('Error deleting product:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.message || 'Error deleting product.');
      }
    }
  };

  const handleEdit = (product) => {
    setProductName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setBrand(product.brand);
    setImageUrl(product.imageUrl || '');

    setEditingProduct(product);

    setMessage(`Now editing "${product.name}". Make your changes and click 'Save Changes'.`);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setProductName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setBrand('');
    setImageUrl('');
    setEditingProduct(null);
    setMessage('');
    setError('');
  };

  return (
    <div className="seller-dashboard-container">
      <h1>Seller Dashboard</h1>

      <section className="create-product-section">
        <h2>{editingProduct ? `Edit Product: ${editingProduct.name}` : 'List a New Product'}</h2>
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
            <input
              type="text"
              id="category"
              list="categories-list" 
              placeholder="Select or type a category" // 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            
            <datalist id="categories-list">
              {fetchedCategories.map((cat) => (
                <option key={cat} value={cat} /> 
              ))}
            </datalist>
          </div>
          <div className="form-group">
            <label htmlFor="brand">Brand:</label>
            <input
              type="text"
              id="brand"
              list="brands-list" 
              placeholder="Select or type a brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
            
            <datalist id="brands-list">
              {fetchedBrands.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
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
          <button type="submit" className="submit-button">
            {editingProduct ? 'Save Changes' : 'Add Product'}
          </button>
          {editingProduct && (
            <button type="button" onClick={handleCancelEdit} className="submit-button cancel-button">
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <section className="manage-products-section">
        <h2>Your Listed Products</h2>
        {loading && <p>Loading products...</p>}
        {fetchError && <p className="error-message">{fetchError}</p>}
        {!loading && !fetchError && products.length === 0 ? (
          <p>No products to manage. Add some using the form above!</p>
        ) : (
          <div className="product-table-container">
            <table className="product-management-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.imageUrl || 'https://via.placeholder.com/50'}
                        alt={product.name}
                        className="product-thumb"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>${product.price ? product.price.toFixed(2) : 'N/A'}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(product)} className="action-button edit-button">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="action-button delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default SellerDashboard;