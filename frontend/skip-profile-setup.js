// Script to mark all users' profiles as complete (useful for development)
import mongoose from 'mongoose';
import User from './server/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-quality-iot';

async function skipProfileSetup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users to have isProfileComplete = true
    const result = await User.updateMany(
      { isProfileComplete: false },
      { $set: { isProfileComplete: true } }
    );

    console.log(`Updated ${result.modifiedCount} user(s) to skip profile setup`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

skipProfileSetup();
