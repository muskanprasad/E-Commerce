// server/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Existing: GET all products with filters
router.get('/products', productController.getProducts);

// NEW: GET a single product by ID
router.get('/products/:id', productController.getProductById);

router.put('/products/:id', productController.updateProduct);

router.delete('/products/:id', productController.deleteProduct);

// NEW: POST route to create a new product
router.post('/products', productController.createProduct);

module.exports = router;