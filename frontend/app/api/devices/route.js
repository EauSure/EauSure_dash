import { NextResponse } from 'next/server';
import { initDatabase } from '@/server/services/database';
import Device from '@/server/models/Device';
import { authenticateToken } from '@/server/middleware/auth';

// GET /api/devices
export async function GET(request) {
  try {
    // Authenticate
    const auth = await authenticateToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = {};
    if (status) query.status = status;

    const devices = await Device.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(devices);
  } catch (error) {
    console.error('Devices fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

// POST /api/devices
export async function POST(request) {
  try {
    // Authenticate
    const auth = await authenticateToken(request);
    if (!auth.authenticated || auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDatabase();

    const body = await request.json();
    const { deviceId, name, location, type } = body;

    if (!deviceId || !name) {
      return NextResponse.json(
        { error: 'Device ID and name are required' },
        { status: 400 }
      );
    }

    const existingDevice = await Device.findOne({ deviceId });
    if (existingDevice) {
      return NextResponse.json(
        { error: 'Device with this ID already exists' },
        { status: 400 }
      );
    }

    const device = new Device({
      deviceId,
      name,
      location,
      type,
      status: 'active',
    });

    await device.save();

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error('Device create error:', error);
    return NextResponse.json(
      { error: 'Failed to create device' },
      { status: 500 }
    );
  }
}
