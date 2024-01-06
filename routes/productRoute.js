const express = require('express');
const productController = require('../controllers/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/').post(roleMiddleware(["selger", "admin"]),productController.createProduct);
router.route('/').get(productController.getAllProducts);
router.route('/:slug').get(productController.getProduct);
router.route('/:slug').delete(productController.deleteProduct);
router.route('/:slug').put(productController.updateProduct);
router.route('/cart').post(productController.addToCart);
router.route('/oldCart').post(productController.removeFromCart);

module.exports = router;