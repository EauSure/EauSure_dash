import mongoose from 'mongoose';
import { createClient } from 'redis';
import logger from '../utils/logger.js';
import Device from '../models/Device.js';
import WaterQuality from '../models/WaterQuality.js';
import Alert from '../models/Alert.js';

// MongoDB connection
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      logger.warn('MONGODB_URI not configured - running without database');
      return;
    }
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    } else {
      logger.warn('Continuing without MongoDB in development mode');
    }
  }
};

// Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

export const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Connect to Redis (optional in development)
    if (process.env.REDIS_URL) {
      try {
        await redisClient.connect();
        logger.info('Redis connected');
      } catch (error) {
        logger.warn('Redis connection failed - continuing without cache:', error);
      }
    } else {
      logger.warn('REDIS_URL not configured - running without cache');
    }
  } catch (error) {
    logger.error('Database initialization error:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    } else {
      logger.warn('Continuing in development mode despite database errors');
    }
  }
};

export const saveWaterQualityData = async (data) => {
  try {
    // Save water quality data
    const waterQuality = new WaterQuality({
      deviceId: data.deviceId,
      ph: data.ph,
      tds: data.tds,
      battery: data.battery,
      timestamp: new Date(data.timestamp),
    });
    await waterQuality.save();

    // Update or create device
    await Device.findOneAndUpdate(
      { deviceId: data.deviceId },
      {
        deviceId: data.deviceId,
        name: `Device ${data.deviceId}`,
        status: 'online',
        battery: data.battery,
        lastSeen: new Date(data.timestamp),
      },
      { upsert: true, new: true }
    );

    logger.info(`Water quality data saved for device ${data.deviceId}`);
  } catch (error) {
    logger.error('Error saving water quality data:', error);
    throw error;
  }
};

export const getWaterQualityData = async (params) => {
  try {
    const query = {};

    if (params.deviceId) {
      query.deviceId = params.deviceId;
    }

    if (params.startTime || params.endTime) {
      query.timestamp = {};
      if (params.startTime) {
        query.timestamp.$gte = new Date(params.startTime);
      }
      if (params.endTime) {
        query.timestamp.$lte = new Date(params.endTime);
      }
    }

    const results = await WaterQuality.find(query)
      .sort({ timestamp: -1 })
      .limit(params.limit || 50)
      .lean();

    return results.map((row) => ({
      timestamp: row.timestamp.toISOString(),
      deviceId: row.deviceId,
      ph: row.ph,
      tds: row.tds,
    }));
  } catch (error) {
    logger.error('Error querying water quality data:', error);
    return [];
  }
};

export const getDevices = async () => {
  try {
    const devices = await Device.find().sort({ lastSeen: -1 }).lean();
    return devices.map((device) => ({
      id: device.deviceId,
      name: device.name,
      location: device.location,
      status: device.status,
      battery: device.battery,
      lastSeen: device.lastSeen.toISOString(),
    }));
  } catch (error) {
    logger.error('Error querying devices:', error);
    return [];
  }
};

export const createAlert = async (alert) => {
  try {
    const newAlert = new Alert({
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      deviceId: alert.deviceId,
      timestamp: new Date(),
    });
    await newAlert.save();
    
    return {
      id: newAlert._id.toString(),
      type: newAlert.type,
      severity: newAlert.severity,
      message: newAlert.message,
      deviceId: newAlert.deviceId,
      timestamp: newAlert.timestamp.toISOString(),
      acknowledged: newAlert.acknowledged,
    };
  } catch (error) {
    logger.error('Error creating alert:', error);
    throw error;
  }
};

export const getAlerts = async (params) => {
  try {
    const query = {};

    if (params?.acknowledged !== undefined) {
      query.acknowledged = params.acknowledged;
    }
    if (params?.severity) {
      query.severity = params.severity;
    }

    const alerts = await Alert.find(query)
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    return alerts.map((alert) => ({
      id: alert._id.toString(),
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      deviceId: alert.deviceId,
      timestamp: alert.timestamp.toISOString(),
      acknowledged: alert.acknowledged,
    }));
  } catch (error) {
    logger.error('Error querying alerts:', error);
    return [];
  }
};

export const acknowledgeAlert = async (alertId) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { acknowledged: true },
      { new: true }
    ).lean();

    if (!alert) {
      return null;
    }

    return {
      id: alert._id.toString(),
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      deviceId: alert.deviceId,
      timestamp: alert.timestamp.toISOString(),
      acknowledged: alert.acknowledged,
    };
  } catch (error) {
    logger.error('Error acknowledging alert:', error);
    throw error;
  }
};

export { redisClient };

