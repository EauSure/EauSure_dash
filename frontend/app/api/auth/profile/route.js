import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import mongoose from 'mongoose';
import User from '@/server/models/User';

// Ensure MongoDB connection
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-quality-iot';
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// GET - Fetch user profile
export async function GET(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Add timeout to the query
    const user = await User.findById(session.user.id)
      .select('-password')
      .maxTimeMS(5000)
      .lean()
      .exec();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    
    // Return more specific error messages
    if (error.name === 'MongooseError' || error.name === 'MongoServerError') {
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, avatar, phone, organization, isProfileComplete } = body;

    await connectDB();

    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user fields
    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;
    if (organization !== undefined) user.organization = organization;
    if (isProfileComplete !== undefined) user.isProfileComplete = isProfileComplete;

    await user.save();

    const updatedUser = user.toJSON();

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    );
  }
}
