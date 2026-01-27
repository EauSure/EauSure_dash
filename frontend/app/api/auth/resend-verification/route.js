import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/server/models/User';
import { sendVerificationEmail } from '@/server/services/email';

// Ensure MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-quality-iot';
    await mongoose.connect(mongoURI);
  }
}

// POST - Resend verification code
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

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email déjà vérifié' },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, verificationCode, user.username);

    return NextResponse.json({
      message: 'Code de vérification renvoyé avec succès'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
