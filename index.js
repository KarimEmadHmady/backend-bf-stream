const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes'); // Import your order routes
const Order = require('./models/Order'); // Adjust the path as necessary
const userRoutes = require('./routes/userRoutes');
// const cron = require('node-cron');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// // Middleware
// // Add CORS configuration here
// const corsOptions = {
//   origin: ['https://bf-stream-karimemadhmady-bfs-projects-3cb62484.vercel.app'], // Frontend origins
//   methods: ['GET', 'POST', 'DELETE', 'PUT'], // Allowed HTTP methods
//   credentials: true, // Allows cookies or credentials to be included in requests
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers in the request
// };



// app.use(cors({
//     origin: [
//         'https://bf-stream-karimemadhmady-bfs-projects-3cb62484.vercel.app', 
//         'https://breakfast-stream.netlify.app'
//     ],
//     methods: ['GET', 'POST', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization/json'],
// }));

// app.options('*', cors()); // Enable preflight for all routes



// // app.use(cors(corsOptions)); // Apply CORS options globally

// // app.options('*', cors(corsOptions)); // Enable preflight for all routes





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



// Function to delete orders older than 20 hours
// const deleteOldOrders = async () => {
//   try {
//     const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000); // 20 hours in milliseconds
//     await Order.deleteMany({ date: { $lt: twentyHoursAgo } });
//     console.log('Old orders deleted successfully');
//   } catch (error) {
//     console.error('Error deleting old orders:', error);
//   }
// };

// Schedule the task to run every 20 hours
// cron.schedule('0 */20 * * *', () => {
//   console.log('Running scheduled task to delete old orders...');
//   deleteOldOrders();
// });

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
