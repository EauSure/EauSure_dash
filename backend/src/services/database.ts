import { Influx } from 'influx';
import pkg from 'pg';
const { Pool } = pkg;
import { createClient } from 'redis';
import logger from '../utils/logger.js';

// InfluxDB client
const influx = new Influx.InfluxDB({
  host: process.env.INFLUXDB_HOST || 'localhost',
  port: parseInt(process.env.INFLUXDB_PORT || '8086'),
  database: process.env.INFLUXDB_DB || 'water_quality',
  username: process.env.INFLUXDB_USER || 'admin',
  password: process.env.INFLUXDB_PASSWORD || 'admin',
  schema: [
    {
      measurement: 'water_quality',
      fields: {
        ph: Influx.FieldType.FLOAT,
        tds: Influx.FieldType.INTEGER,
        battery: Influx.FieldType.INTEGER,
      },
      tags: ['deviceId'],
    },
  ],
});

// PostgreSQL client
const pgPool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'water_quality',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
});

// Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

export const initDatabase = async (): Promise<void> => {
  try {
    // Initialize InfluxDB
    const databases = await influx.getDatabaseNames();
    if (!databases.includes(process.env.INFLUXDB_DB || 'water_quality')) {
      await influx.createDatabase(process.env.INFLUXDB_DB || 'water_quality');
      logger.info('InfluxDB database created');
    }

    // Initialize PostgreSQL tables
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS devices (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'offline',
        battery INTEGER,
        last_seen TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        device_id VARCHAR(255) REFERENCES devices(id),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        acknowledged BOOLEAN DEFAULT FALSE
      );
    `);

    logger.info('PostgreSQL tables initialized');

    // Connect to Redis
    await redisClient.connect();
    logger.info('Redis connected');
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
};

export const saveWaterQualityData = async (data: {
  deviceId: string;
  ph: number;
  tds: number;
  battery: number;
  timestamp: string;
}): Promise<void> => {
  try {
    await influx.writePoints([
      {
        measurement: 'water_quality',
        tags: { deviceId: data.deviceId },
        fields: {
          ph: data.ph,
          tds: data.tds,
          battery: data.battery,
        },
        timestamp: new Date(data.timestamp),
      },
    ]);

    // Update device status in PostgreSQL
    await pgPool.query(
      `INSERT INTO devices (id, name, location, status, battery, last_seen)
       VALUES ($1, $2, $3, 'online', $4, $5)
       ON CONFLICT (id) DO UPDATE
       SET status = 'online', battery = $4, last_seen = $5`,
      [data.deviceId, `Device ${data.deviceId}`, 'Unknown', data.battery, new Date(data.timestamp)]
    );
  } catch (error) {
    logger.error('Error saving water quality data:', error);
    throw error;
  }
};

export const getWaterQualityData = async (params: {
  deviceId?: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
}): Promise<any[]> => {
  try {
    let query = 'SELECT * FROM water_quality';
    const conditions: string[] = [];

    if (params.deviceId) {
      conditions.push(`"deviceId" = '${params.deviceId}'`);
    }
    if (params.startTime) {
      conditions.push(`time >= '${params.startTime}'`);
    }
    if (params.endTime) {
      conditions.push(`time <= '${params.endTime}'`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY time DESC';

    if (params.limit) {
      query += ` LIMIT ${params.limit}`;
    }

    const results = await influx.query(query);
    return results.map((row: any) => ({
      timestamp: row.time.toISOString(),
      deviceId: row.deviceId,
      ph: row.ph,
      tds: row.tds,
    }));
  } catch (error) {
    logger.error('Error querying water quality data:', error);
    return [];
  }
};

export const getDevices = async (): Promise<any[]> => {
  try {
    const result = await pgPool.query('SELECT * FROM devices ORDER BY last_seen DESC');
    return result.rows;
  } catch (error) {
    logger.error('Error querying devices:', error);
    return [];
  }
};

export const createAlert = async (alert: {
  type: string;
  severity: string;
  message: string;
  deviceId: string;
}): Promise<any> => {
  try {
    const result = await pgPool.query(
      `INSERT INTO alerts (type, severity, message, device_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [alert.type, alert.severity, alert.message, alert.deviceId]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating alert:', error);
    throw error;
  }
};

export const getAlerts = async (params?: {
  acknowledged?: boolean;
  severity?: string;
}): Promise<any[]> => {
  try {
    let query = 'SELECT * FROM alerts';
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (params?.acknowledged !== undefined) {
      conditions.push(`acknowledged = $${paramIndex++}`);
      values.push(params.acknowledged);
    }
    if (params?.severity) {
      conditions.push(`severity = $${paramIndex++}`);
      values.push(params.severity);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY timestamp DESC LIMIT 100';

    const result = await pgPool.query(query, values);
    return result.rows;
  } catch (error) {
    logger.error('Error querying alerts:', error);
    return [];
  }
};

export { influx, pgPool, redisClient };
