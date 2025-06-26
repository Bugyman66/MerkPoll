const mongoose = require('mongoose');

// Individual vote for a specific position and candidate
const VoteSchema = new mongoose.Schema({
  election: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Election', 
    required: true 
  },
  
  position: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  
  candidate: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  
  // Privacy protection
  voterHash: { 
    type: String, 
    required: true 
  }, // Hash of voter's email or identifier
  
  // Blockchain integration
  transactionHash: { type: String },
  blockNumber: { type: Number },
  
  // Metadata
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
});

// Compound index to prevent duplicate votes
VoteSchema.index({ 
  election: 1, 
  position: 1, 
  voterHash: 1 
}, { unique: true });

// Index for efficient querying
VoteSchema.index({ election: 1, position: 1 });
VoteSchema.index({ election: 1, timestamp: 1 });

module.exports = mongoose.model('Vote', VoteSchema);
