const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ type: Object, required: true }],
  total: { type: Number, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comment: { // Add the comment field
    type: String,
    default: '' // Optional: default to empty string if no comment is provided
  },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
 

