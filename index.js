const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes'); // Import your order routes
const Order = require('./models/Order'); // Adjust the path as necessary
const userRoutes = require('./routes/userRoutes');
const cron = require('node-cron');
const buttonRoutes = require('./routes/buttonRoutes'); // Import button routes


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

//Medilewear
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Allows cross-origin requests
app.use(cookieParser()); // Parses cookies sent in requests

// Connect to MongoDB
// mongoose.connect(MONGO_URI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


// Use the routes
app.use('/api/orders', orderRoutes); // Register the order routes
app.use('/api/button', buttonRoutes); // Register the button routes


const deleteOldOrders = async () => {
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago
    const result = await Order.deleteMany({ date: { $lt: twelveHoursAgo } });
    console.log(`Old orders deleted: ${result.deletedCount}`); // Use backticks for template literals
  } catch (error) {
    console.error('Error deleting old orders:', error);
  }
};


// Schedule the task to run every 12 hours
cron.schedule('0 */12 * * *', () => {
  console.log('Running scheduled task to delete old orders...');
  deleteOldOrders();
});



app.use((req, res, next) => {
    console.log(`Received request for: ${req.originalUrl}`);
    next();
});


// Sample Route
app.get('/', (req, res) => {
  res.send('Backend is running.....');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
