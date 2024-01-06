const nodemailer = require('nodemailer');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getAboutPage = (req, res) => {
    res.status(200).render('about', {
      page_name: 'about',
    });
  };

exports.getIndexPage = async (req, res) => {
  
    const products = await Product.find().sort('-createdAt').limit(3);
    const totalProducts = await Product.find().countDocuments();
    const totalUsers = await User.countDocuments({role: 'user'});
    const totalSelgers = await User.countDocuments({role: 'selger'});

    res.status(200).render('index', {
      page_name: 'index',
      products,
      totalProducts,
      totalUsers,
      totalSelgers
    });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
}

exports.sendEmail = async (req, res) => {
  try{
  const outputMessage = `
  <h1>Mail Details</h1>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h1>Message</h1>
  <p>${req.body.message}</p>
  `
  
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
      user: 'arifozden1@gmail.com',
      pass: 'oqgzwwjnxihbayki'
    },
});
let info = await transporter.sendMail({
  from: '"DonerTo" <arifozden1@gmail.com>',
  to: "akininci5454@gmail.com",
  subject: "DonerTo New Message",
  html: outputMessage
});
console.log("Message sent: %s", info.messageId);
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

req.flash('success', 'Your message sent successfully!');

res.status(200).redirect('/contact');
}catch(err){
  console.log(err);
  req.flash('error', 'Your message could not sent!');
  res.status(400).redirect('/contact');
}
};