const express = require('express');
const router = express.Router();

// Example vote route
router.get('/test', (req, res) => {
  res.json({ message: 'Vote route working!' });
});

module.exports = router;
