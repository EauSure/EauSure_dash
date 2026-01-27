import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import the actual User model from the server
import User from './server/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@water-quality.com';
    const password = 'Admin123!';
    const name = 'Administrator';

    // Delete existing admin if exists
    await User.deleteOne({ email });
    console.log('Removed existing admin user (if any)');

    // Create admin user (password will be hashed by pre-save hook)
    const admin = new User({
      email,
      password, // Don't hash here - the pre-save hook will do it
      name,
      role: 'admin',
      isProfileComplete: true,
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------');
    console.log('\nYou can now login at http://localhost:3000/login');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
