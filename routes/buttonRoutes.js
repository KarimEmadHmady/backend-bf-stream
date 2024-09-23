const express = require('express');
const router = express.Router();

let buttonDisabledUntil = null; // In-memory storage for button state

// GET route to check if the button is disabled
router.get('/status', (req, res) => {
  if (buttonDisabledUntil && new Date(buttonDisabledUntil) > new Date()) {
    return res.status(200).json({ isDisabled: true, until: buttonDisabledUntil });
  }
  return res.status(200).json({ isDisabled: false });
});

// POST route to disable the button for 10 hours
router.post('/disable', (req, res) => {
  const disableTime = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours
  buttonDisabledUntil = disableTime;
  return res.status(200).json({ message: 'Button disabled for 10 hours.', until: buttonDisabledUntil });
});

module.exports = router;
