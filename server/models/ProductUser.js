const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productUserSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const ProductUser = mongoose.model('ProductUser', productUserSchema);
module.exports = ProductUser;