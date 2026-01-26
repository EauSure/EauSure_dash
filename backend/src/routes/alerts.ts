import { Router } from 'express';
import { getAlerts, pgPool } from '../services/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { acknowledged, severity } = req.query;
    
    const alerts = await getAlerts({
      acknowledged: acknowledged === 'true',
      severity: severity as string,
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.patch('/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pgPool.query(
      'UPDATE alerts SET acknowledged = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

export default router;
