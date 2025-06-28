// Admin routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const electionController = require('../controllers/electionController');
const verifyToken = require('../middlewares/verifyToken');

// Admin authentication
router.post('/login', authController.login);
router.get('/profile', verifyToken, authController.getProfile);
router.post('/relayer/refresh-balance', verifyToken, authController.refreshRelayerBalance);

// Election management
router.post('/elections', verifyToken, electionController.createElection);
router.get('/elections', verifyToken, electionController.getAdminElections);
router.get('/elections/:id', verifyToken, electionController.getElectionDetails);
router.put('/elections/:id', verifyToken, electionController.updateElection);
router.delete('/elections/:id', verifyToken, electionController.deleteElection);

// Voter management
router.post('/elections/:id/voters', verifyToken, electionController.uploadVoters);
router.get('/elections/:id/voters', verifyToken, electionController.getElectionVoters);

// Results and analytics
router.get('/elections/:id/results', verifyToken, electionController.getElectionResults);
router.get('/elections/:id/analytics', verifyToken, electionController.getElectionAnalytics);

module.exports = router;
