const express = require('express');

const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.route('/').post(categoryController.createCategory);
router.route('/').get(categoryController.getAllCategories);
router.route('/:slug').get(categoryController.getCategory);
router.route('/:id').delete(categoryController.deleteCategory);

module.exports = router;