const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

// Example auth route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

// Example: Send OTP to voter email
router.post('/send-otp', authController.sendOtp);

// Example: Verify OTP and return voter wallet
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
