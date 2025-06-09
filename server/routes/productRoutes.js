const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getProducts);

router.get('/products/:id', productController.getProductById);

router.put('/products/:id', productController.updateProduct);

router.delete('/products/:id', productController.deleteProduct);

router.post('/products', productController.createProduct);

router.get('/categories', productController.getUniqueCategories);

router.get('/brands', productController.getUniqueBrands);

module.exports = router;