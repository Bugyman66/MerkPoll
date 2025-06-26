const mongoose = require('mongoose');
require('dotenv').config();

async function migrateVoterIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/merkpoll');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('voters');

    // Check if the old index exists
    const indexes = await collection.indexes();
    const hasOldIndex = indexes.some(index => index.name === 'emailHash_1');

    if (hasOldIndex) {
      console.log('Dropping old emailHash_1 index...');
      await collection.dropIndex('emailHash_1');
      console.log('Old index dropped successfully');
    } else {
      console.log('Old emailHash_1 index does not exist');
    }

    // Create new compound index
    console.log('Creating new compound index...');
    await collection.createIndex(
      { emailHash: 1, election: 1 }, 
      { unique: true, name: 'emailHash_election_compound' }
    );
    console.log('New compound index created successfully');

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateVoterIndex();
