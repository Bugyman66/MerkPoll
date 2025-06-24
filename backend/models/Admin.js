const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);
