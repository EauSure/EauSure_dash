import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import waterQualityRouter from './routes/waterQuality.js';
import devicesRouter from './routes/devices.js';
import alertsRouter from './routes/alerts.js';
import { initMQTT } from './services/mqtt.js';
import { initDatabase } from './services/database.js';
import logger from './utils/logger.js';

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

// Routes
app.use('/api/water-quality', waterQualityRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/alerts', alertsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize services
const initServices = async () => {
  try {
    await initDatabase();
    await initMQTT(io);
    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Export io for use in other modules
export { io };

// Start server
const PORT = process.env.PORT || 3000;

initServices().then(() => {
  httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});
