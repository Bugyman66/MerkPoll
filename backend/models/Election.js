const mongoose = require('mongoose');

// Candidate schema for better structure
const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  party: { type: String },
  qualifications: { type: String },
  voteCount: { type: Number, default: 0 }
});

// Position schema for organized election structure
const PositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  maxSelections: { type: Number, default: 1 }, // Allow multiple selections for some positions
  candidates: [CandidateSchema],
  totalVotes: { type: Number, default: 0 }
});

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  organization: { type: String }, // School, Company, Organization name
  deadline: { type: Date, required: true },
  startDate: { type: Date, default: Date.now },
  
  // Enhanced positions structure
  positions: [PositionSchema],
  
  // Voting configuration
  allowAbstain: { type: Boolean, default: true },
  requireAllPositions: { type: Boolean, default: false },
  
  // Privacy and security
  merkleRoot: { type: String },
  voterList: [{ email: String, hasVoted: { type: Boolean, default: false } }],
  
  // Election status and metadata
  status: { 
    type: String, 
    enum: ['draft', 'active', 'ended', 'cancelled'], 
    default: 'draft' 
  },
  resultsVisible: { type: Boolean, default: false },
  
  // Admin and tracking
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true }, // Unique link for election
  voterWallets: [
    {
      hashedEmail: { type: String, required: true },
      walletAddress: { type: String, required: true }
    }
  ]
});

// Update timestamp on save
ElectionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Election', ElectionSchema);
