import { NextResponse } from 'next/server';
import { initDatabase } from '@/server/services/database';
import Alert from '@/server/models/Alert';
import { authenticateToken } from '@/server/middleware/auth';

// PATCH /api/alerts/[id]/acknowledge
export async function PATCH(request, { params }) {
  try {
    // Authenticate
    const auth = await authenticateToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDatabase();

    const { id } = params;

    const alert = await Alert.findByIdAndUpdate(
      id,
      { acknowledged: true, acknowledgedAt: new Date() },
      { new: true }
    );

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Alert acknowledge error:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge alert' },
      { status: 500 }
    );
  }
}
