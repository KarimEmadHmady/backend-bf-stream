const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [{ type: Object, required: true }],
  total: { type: Number, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comment: {
    type: String,
    default: "",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
