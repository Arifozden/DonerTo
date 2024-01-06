const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    const errors = validationResult (req);

    for(let i=0; i<errors.array().length; i++){
      req.flash('error', `${errors.array()[i].msg}`);
    }

    res.status(400).redirect('/register');
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // USER SESSION
        req.session.userID = user._id;
        res.status(200).redirect('/users/dashboard');
      } else {
        req.flash('error', 'Password is not correct');
        res.status(400).redirect('/login');
      }
    } else {
      req.flash('error', 'Email is not correct');
      res.status(400).redirect('/login');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    await req.session.destroy(()=>
    res.status(200).redirect('/')
  ) 
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate('products');
  const categories = await Category.find();
  const products = await Product.find({ user: req.session.userID });
  const users = await User.find();
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    products,
    users
  });
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Product.deleteMany({ user: req.params.id });
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    // Hata durumunda istemciye hata bilgisini gönder
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};