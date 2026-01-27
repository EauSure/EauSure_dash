import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/server/models/User';

// Ensure MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-quality-iot';
    await mongoose.connect(mongoURI);
  }
}

// POST - Verify email with code
export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code requis' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Code invalide ou expiré' },
        { status: 400 }
      );
    }

    // Mark email as verified and clear verification code
    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    return NextResponse.json({
      message: 'Email vérifié avec succès'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
