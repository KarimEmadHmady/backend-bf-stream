const mongoose = require('mongoose');

const checkboxStatusSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('CheckboxStatus', checkboxStatusSchema);
