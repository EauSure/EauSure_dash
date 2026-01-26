import { Router } from 'express';
import { getAlerts, acknowledgeAlert } from '../services/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { acknowledged, severity } = req.query;
    
    const alerts = await getAlerts({
      acknowledged: acknowledged === 'true',
      severity,
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.patch('/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await acknowledgeAlert(id);

    if (!result) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

export default router;
