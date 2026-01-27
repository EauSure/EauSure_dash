import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import mongoose from 'mongoose';
import User from '@/server/models/User';

// Ensure MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-quality-iot';
    await mongoose.connect(mongoURI);
  }
}

// PUT - Change user password
export async function PUT(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 400 }
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return NextResponse.json({ 
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Échec de la modification du mot de passe', details: error.message },
      { status: 500 }
    );
  }
}
