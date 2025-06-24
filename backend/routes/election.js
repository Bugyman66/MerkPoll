const express = require('express');
const router = express.Router();

// Election routes

// Example election route
router.get('/test', (req, res) => {
  res.json({ message: 'Election route working!' });
});

module.exports = router;
