const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  email: { type: String },
  
  // Relayer Wallet for gasless transactions
  relayerWallet: {
    address: { type: String },
    privateKey: { type: String }, // Encrypted in practice
    publicKey: { type: String },
    balance: { type: String, default: '0' }, // APT balance
    lastBalanceUpdate: { type: Date },
    isFunded: { type: Boolean, default: false }
  },
  
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);
