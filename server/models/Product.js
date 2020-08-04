const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    minlength: 5     
  },
  url: {
    type: Schema.Types.String,
    required: true
  },
  description: {
    type: Schema.Types.String,
    required: true,
    minlength: 20
  },
  likes: {
    type: Schema.Types.Number,
    required: true
  },  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;