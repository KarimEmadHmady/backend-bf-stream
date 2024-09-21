 const mongoose = require('mongoose'); 

const menuItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
});

module.exports = mongoose.model('Menu', menuItemSchema);
 
