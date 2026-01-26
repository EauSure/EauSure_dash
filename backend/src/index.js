import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import waterQualityRouter from './routes/waterQuality.js';
import devicesRouter from './routes/devices.js';
import alertsRouter from './routes/alerts.js';
import { initMQTT } from './services/mqtt.js';
import { initDatabase } from './services/database.js';
import logger from './utils/logger.js';

config();

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Vercel compatibility
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json());

// Routes
app.use('/api/water-quality', waterQualityRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/alerts', alertsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Water Quality Monitoring API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      waterQuality: '/api/water-quality',
      devices: '/api/devices',
      alerts: '/api/alerts'
    }
  });
});

// Initialize services (singleton pattern for serverless)
let initialized = false;
const initServices = async () => {
  if (initialized) return;
  
  try {
    await initDatabase();
    // MQTT initialization without Socket.IO
    if (process.env.MQTT_BROKER) {
      await initMQTT();
    }
    initialized = true;
    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
};

// Middleware to ensure services are initialized
app.use(async (req, res, next) => {
  try {
    await initServices();
    next();
  } catch (error) {
    logger.error('Service initialization error:', error);
    res.status(503).json({ error: 'Service temporarily unavailable' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server (for local development only)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  initServices().then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  }).catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export for Vercel serverless
export default app;
