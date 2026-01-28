import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/server/models/User';
import { sendVerificationEmail } from '@/server/services/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Ensure MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-quality-iot';
    await mongoose.connect(mongoURI);
  }
}

// POST /api/auth/register
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, name, role } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom sont requis' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

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

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Generate verification code (6-digit number)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      role: role || 'user',
      emailVerified: false,
      verificationCode,
      verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationCode, user.name);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    return NextResponse.json(
      {
        message: 'Compte créé avec succès. Veuillez vérifier votre email.',
        email: user.email,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
