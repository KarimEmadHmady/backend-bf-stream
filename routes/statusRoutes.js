const CheckboxStatus = require('../models/CheckboxStatus');
const express = require('express');
const router = express.Router();
const CheckboxStatus = require('../models/CheckboxStatus');




// GET current status
router.get('/current-status', async (req, res) => {
    try {
      const status = await CheckboxStatus.findOne();
      res.json({ status: status ? status.status : false });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get status' });
    }
  });
  
  // POST update status
  router.post('/update-status', async (req, res) => {
    const { status } = req.body;
    try {
      let checkboxStatus = await CheckboxStatus.findOne();
      if (!checkboxStatus) {
        checkboxStatus = new CheckboxStatus({ status });
      } else {
        checkboxStatus.status = status;
      }
      await checkboxStatus.save();
      res.json({ status: checkboxStatus.status });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

  module.exports = router;