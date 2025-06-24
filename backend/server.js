const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      ssl: true,
    });
    console.log("✅ Connected to Azure Cosmos DB (Mongo API)");
  } catch (err) {
    console.error("❌ Failed to connect:", err.message);
  }
};

connectDB();

module.exports = connectDB;
