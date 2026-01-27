import { NextResponse } from 'next/server';
import { initDatabase } from '@/server/services/database';
import WaterQuality from '@/server/models/WaterQuality';
import { authenticateToken } from '@/server/middleware/auth';

// GET /api/water-quality
export async function GET(request) {
  try {
    // Authenticate
    const auth = await authenticateToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDatabase();

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query = {};
    if (deviceId) query.deviceId = deviceId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Get total count
    const total = await WaterQuality.countDocuments(query);

    // Get paginated data
    const data = await WaterQuality.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Water quality fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch water quality data' },
      { status: 500 }
    );
  }
}

// POST /api/water-quality
export async function POST(request) {
  try {
    // Authenticate
    const auth = await authenticateToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDatabase();

    const body = await request.json();
    const { deviceId, ph, turbidity, temperature, tds, location } = body;

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      );
    }

    const waterQualityData = new WaterQuality({
      deviceId,
      ph,
      turbidity,
      temperature,
      tds,
      location,
      timestamp: new Date(),
    });

    await waterQualityData.save();

    return NextResponse.json(waterQualityData, { status: 201 });
  } catch (error) {
    console.error('Water quality create error:', error);
    return NextResponse.json(
      { error: 'Failed to create water quality data' },
      { status: 500 }
    );
  }
}
