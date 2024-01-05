const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createProduct = async (req, res) => {
  
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      user: req.session.userID,
    });
    res.status(201).redirect('/products');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};

    if (categorySlug) {
      filter = { category: category._id };
    }

    const products = await Product.find(filter).sort('-createdAt'); // Corrected this line
    const categories = await Category.find({});
    res.status(200).render('products', {
      products,
      categories,
      page_name: 'products'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};


  exports.getProduct = async (req, res) => {
  
    try {
      const product = await Product.findOne({slug: req.params.slug}).populate('user');
      res.status(200).render('product',{
        product,
        page_name: 'product'
      })
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  };

  exports.addToCart = async (req, res) => {
    try {
      
      const user = await User.findById(req.session.userID);
      await user.products.push({_id: req.body.product_id});
      await user.save();

      res.status(200).redirect('/users/dashboard');
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      });
    }
  }