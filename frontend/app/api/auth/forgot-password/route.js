import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '@/server/models/User';
import { sendPasswordResetEmail } from '@/server/services/email';

// Ensure MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-quality-iot';
    await mongoose.connect(mongoURI);
  }
}

// POST - Request password reset
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Don't reveal if user exists or not (security)
    if (!user) {
      return NextResponse.json({
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email
    const emailResult = await sendPasswordResetEmail(user.email, user.name, resetToken);

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.message);
    }

    return NextResponse.json({
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
