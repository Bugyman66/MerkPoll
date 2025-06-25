const express = require('express');
const router = express.Router();

// Basic auth route for testing
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

// Note: Wallet-based authentication is handled in admin routes
// No email/OTP authentication needed for simplified flow

module.exports = router;
