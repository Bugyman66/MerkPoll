const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');

// Public election routes (for voters)
router.get('/', electionController.getPublicElections);
router.get('/:id', electionController.getElectionDetails);

module.exports = router;
