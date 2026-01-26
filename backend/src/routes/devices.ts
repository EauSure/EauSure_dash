import { Router } from 'express';
import { getDevices } from '../services/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const devices = await getDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

export default router;
