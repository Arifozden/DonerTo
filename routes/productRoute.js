const express = require('express');
const productController = require('../controllers/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/').post(roleMiddleware(["selger", "admin"]),productController.createProduct);
router.route('/').get(productController.getAllProducts);
router.route('/:slug').get(productController.getProduct);
router.route('/cart').post(productController.addToCart);

module.exports = router;