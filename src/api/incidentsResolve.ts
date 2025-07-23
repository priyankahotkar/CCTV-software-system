import express from 'express';
import { incidentService } from '../services/incidentService';

const router = express.Router();

// PATCH /api/incidents/:id/resolve
router.patch('/api/incidents/:id/resolve', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing incident id' });
    return;
  }
  const updatedIncident = await incidentService.resolveIncident(id);
  if (updatedIncident) {
    res.json(updatedIncident);
  } else {
    res.status(404).json({ error: 'Incident not found' });
  }
});

export default router;
