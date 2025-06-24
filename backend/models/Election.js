const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  positions: [{
    title: String,
    candidates: [String]
  }],
  merkleRoot: { type: String },
  status: { type: String, enum: ['created', 'started', 'ended'], default: 'created' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Election', ElectionSchema);
