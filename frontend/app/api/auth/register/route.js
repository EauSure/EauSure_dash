import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/server/models/User';

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

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      role: role || 'user',
      emailVerified: true,
    });

    await user.save();

    return NextResponse.json(
      {
        message: 'Compte créé avec succès.',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
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
