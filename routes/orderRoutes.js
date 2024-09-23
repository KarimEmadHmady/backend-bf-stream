// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const { items, total, customer } = req.body;

        // Correct the method to check if items is an array
        if (!Array.isArray(items) || typeof total !== 'number' || typeof customer !== 'object') {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const { name, email } = customer;
        if (!name || !email) {
            return res.status(400).json({ error: 'Customer information is incomplete' });
        }

        const newOrder = new Order({
            items: req.body.items,
            total: req.body.total,
            comment: req.body.comment, // Save the comment
            customer: {
              name: req.body.customer.name,
              email: req.body.customer.email
            },
            user: req.body.user,
          });

        await newOrder.save();
        res.status(201).json({ message: 'Order saved successfully!' });
    } catch (error) {
        console.error('Error saving order:', error); // Detailed logging
        res.status(500).json({ error: 'Error saving order' });
    }
});




router.get('/', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from MongoDB
    res.status(200).json(orders); // Send orders back to client
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({ message: 'Error retrieving order' });
    }
});


router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const userEmail = req.query.email; // Get the user's email from query parameters

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the logged-in user is the one who placed the order
    if (order.customer.email !== userEmail) {
      return res.status(403).json({ message: 'You can only delete your own orders' });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

  
// Update order requested status
router.patch('/:id/requested', async (req, res) => {
  try {
    const { requested } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { requested }, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

router.get('/order-request-status', async (req, res) => {
  // Fetch the order request status from your database
  const requestStatus = await Order.findOne(); // Adjust as necessary
  res.json({ requested: requestStatus.requested });
});

router.post('/order-request', async (req, res) => {
  const { requested } = req.body;
  // Update the order request status in your database
  await Order.updateOne({}, { requested }); // Adjust as necessary
  res.json({ success: true });
});



module.exports = router;



