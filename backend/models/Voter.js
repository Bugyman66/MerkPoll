const mongoose = require('mongoose');

// Voter schema
const VoterSchema = new mongoose.Schema({
  emailHash: { type: String, required: true },
  wallet: { type: String, required: true },
  election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  otpVerified: { type: Boolean, default: false },
  hasVoted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Create compound unique index to allow same email in different elections
VoterSchema.index({ emailHash: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('Voter', VoterSchema);
