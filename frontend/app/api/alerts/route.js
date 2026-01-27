import { NextResponse } from 'next/server';
import { initDatabase } from '@/server/services/database';
import Alert from '@/server/models/Alert';
import { authenticateToken } from '@/server/middleware/auth';

// GET /api/alerts
export async function GET(request) {
  try {
    // Authenticate
    const auth = await authenticateToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDatabase();

    const { searchParams } = new URL(request.url);
    const acknowledged = searchParams.get('acknowledged');
    const severity = searchParams.get('severity');

    const query = {};
    if (acknowledged !== null) {
      query.acknowledged = acknowledged === 'true';
    }
    if (severity) {
      query.severity = severity;
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Alerts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
