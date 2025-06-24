// Admin routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

// Example admin route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route working!' });
});

// Admin login via wallet
router.post('/login', authController.login);

// Example protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

module.exports = router;
