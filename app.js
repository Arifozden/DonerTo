const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const pageRoute = require('./routes/pageRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');


const app = express();

//Connect DB
mongoose
  .connect('mongodb+srv://arifozden1:voqlAqQQL0UAu6jT@cluster0.6wzadk5.mongodb.net/?retryWrites=true&w=majority', {
    connectTimeoutMS: 30000,
  })
  .then(() => {
    console.log('DB CONNECTED!');
  })
  .catch((err) => {
    console.log(err);
  });

//Template engine
app.set('view engine', 'ejs');

//Global variables
global.userIN = null;

//Middlewares
app.use(express.static('public'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'my_keyboard_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://arifozden1:voqlAqQQL0UAu6jT@cluster0.6wzadk5.mongodb.net/?retryWrites=true&w=majority' }),
}))
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(methodOverride('_method', {
  methods: ['POST', 'GET']
}));

//Routes
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/categories', categoryRoute);
app.use('/products', productRoute);
app.use('/users', userRoute);
app.post('/contact', (req, res) => {
  const { message } = req.body;
  // Burada gelen mesajı işleyebilir ve gerektiğinde satıcıya iletilebilir
  console.log('Message from buyer:', message);
  // İşleme göre bir yanıt verilebilir
  res.send('Your message sent!');
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
