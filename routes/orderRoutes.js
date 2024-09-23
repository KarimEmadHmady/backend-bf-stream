// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const CheckboxStatus = require('../models/CheckboxStatus');

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

  

// Endpoint to update the checkbox status
router.post('/update-status', async (req, res) => {
  const { status } = req.body; // Expecting { status: boolean }

  try {
    let checkboxStatus = await CheckboxStatus.findOne();
    
    if (!checkboxStatus) {
      checkboxStatus = new CheckboxStatus({ status });
    } else {
      checkboxStatus.status = status;
    }

    await checkboxStatus.save();
    res.status(200).json(checkboxStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
});

// Endpoint to get the current checkbox status
router.get('/current-status', async (req, res) => {
  try {
    const checkboxStatus = await CheckboxStatus.findOne();
    res.status(200).json(checkboxStatus || { status: false });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching status', error });
  }
});


module.exports = router;



