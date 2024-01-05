const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    image: {
        type: String,
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

ProductSchema.pre('validate', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;