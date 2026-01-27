import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '@/server/models/User';

// Ensure MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-quality-iot';
    await mongoose.connect(mongoURI);
  }
}

// POST - Reset password with token
export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token et nouveau mot de passe requis' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir des majuscules et des minuscules' },
        { status: 400 }
      );
    }

    if (!hasNumber) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins un chiffre' },
        { status: 400 }
      );
    }

    await connectDB();

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
