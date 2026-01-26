import { Router } from 'express';
import { getWaterQualityData } from '../services/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { deviceId, startTime, endTime, limit } = req.query;
    
    const data = await getWaterQualityData({
      deviceId: deviceId as string,
      startTime: startTime as string,
      endTime: endTime as string,
      limit: limit ? parseInt(limit as string) : 50,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch water quality data' });
  }
});

export default router;
