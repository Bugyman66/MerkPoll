require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MerkPoll backend is running.' });
});

// Import routes
const adminRoutes = require('./routes/admin');
const electionRoutes = require('./routes/election');
const voteRoutes = require('./routes/vote');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { ssl: true });
    console.log('✅ Connected to Azure Cosmos DB (Mongo API)');
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect:', err.message);
    process.exit(1);
  }
};

connectDB();
