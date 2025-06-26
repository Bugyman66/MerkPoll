const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');

// Public election routes (for voters)
router.get('/', electionController.getPublicElections);
router.get('/:id', electionController.getElectionDetails);

// Public route to get election by slug
router.get('/slug/:slug', electionController.getElectionBySlug);

// Public route to get voter's wallet address by election slug and email
router.get('/slug/:slug/wallet', electionController.getVoterWalletByEmail);

// OTP routes for voting
router.post('/slug/:slug/request-otp', electionController.requestOtp);
router.post('/slug/:slug/verify-otp', electionController.verifyOtp);

module.exports = router;
