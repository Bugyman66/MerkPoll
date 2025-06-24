const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Auth controller logic

exports.sendOtp = async (req, res) => {
  // TODO: Implement OTP sending logic
  res.json({ message: 'OTP sent (mock)' });
};

exports.verifyOtp = async (req, res) => {
  // TODO: Implement OTP verification logic
  res.json({ message: 'OTP verified (mock)', wallet: 'mock_wallet_address' });
};

exports.login = async (req, res) => {
  const { walletAddress, signature } = req.body;
  if (!walletAddress || !signature) {
    return res.status(400).json({ error: 'Wallet address and signature required.' });
  }

  // TODO: Validate signature using Aptos SDK (mocked for now)
  const isValid = true; // Replace with real signature validation
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid wallet signature.' });
  }

  // Find or create admin
  let admin = await Admin.findOne({ walletAddress });
  if (!admin) {
    admin = await Admin.create({ walletAddress });
  }

  // Issue JWT
  const token = jwt.sign({ id: admin._id, walletAddress }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, admin: { walletAddress: admin.walletAddress } });
};
