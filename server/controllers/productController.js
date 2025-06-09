// server/controllers/productController.js

const Product = require('../models/Product'); // Ensure Product model is imported

// Your existing getProducts function (no changes here, just for context)
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, brand } = req.query;
    console.log('Backend: Received query parameters (GET):', req.query);

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    console.log('Backend: Constructed MongoDB query (GET):', query);

    const products = await Product.find(query);
    console.log(`Backend: Found ${products.length} products for query.`);
    res.json({ products });
  } catch (err) {
    console.error('Backend: Error fetching products:', err);
    res.status(500).json({ message: 'Server Error: Could not fetch products' });
  }
};

// NEW: Function to get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Get ID from URL parameters
        console.log(`Backend: Fetching product with ID: ${req.params.id}`);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product); // Send the found product
    } catch (err) {
        console.error('Backend: Error fetching single product:', err);
        // Handle invalid ID format (e.g., not a valid MongoDB ObjectId)
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: 'Server Error: Could not fetch product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from URL

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Backend: Product deleted successfully:', deletedProduct.name);
        res.json({ message: 'Product deleted successfully!', product: deletedProduct });
    } catch (err) {
        console.error('Backend: Error deleting product:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: 'Server Error: Could not delete product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from URL
        const { name, description, price, category, brand, imageUrl, countInStock } = req.body; // Get updated data from request body

        // Basic validation: Check if required fields are present if they are being updated
        // You can make this more robust depending on which fields are truly optional or required on update
        if (!name || !description || !price || !category || !brand || countInStock === undefined) {
            return res.status(400).json({ message: 'Please provide all required fields for update: name, description, price, category, brand, countInStock.' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price: parseFloat(price), category, brand, imageUrl, countInStock: parseInt(countInStock) },
            { new: true, runValidators: true } // new: true returns the updated document, runValidators: true runs schema validators
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Backend: Product updated successfully:', updatedProduct);
        res.json({ message: 'Product updated successfully!', product: updatedProduct });
    } catch (err) {
        console.error('Backend: Error updating product:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        res.status(500).json({ message: 'Server Error: Could not update product' });
    }
};

// NEW: Function to create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, imageUrl } = req.body;
    console.log('Backend: Received data for new product (POST):', req.body);

    // Basic validation: Check if required fields are present
    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({ message: 'Please provide all required fields: name, description, price, category, brand.' });
    }

    // Create a new Product instance using the Mongoose model
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      brand,
      imageUrl: imageUrl || 'https://via.placeholder.com/150',
      countInStock: 10, // <--- ADD THIS LINE with a default value (or 0, 1, etc.)
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();
    console.log('Backend: Product saved successfully:', savedProduct);

    // Send a success response back to the frontend
    res.status(201).json({ message: 'Product added successfully!', product: savedProduct });
  } catch (err) {
    console.error('Backend: Error creating product:', err);
    // Handle specific Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    // Generic server error
    res.status(500).json({ message: 'Server Error: Could not create product' });
  }
};