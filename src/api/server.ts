import express from 'express';
import cors from 'cors';
import { incidentService } from '../services/incidentService';
import { Request, Response } from 'express';

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/incidents?resolved=false
app.get('/api/incidents', async (req, res) => {
  const resolved = req.query.resolved === 'true' ? true : false;
  const incidents = await incidentService.getIncidents(resolved);
  res.json(incidents);
});

// PATCH /api/incidents/:id/resolve
app.patch('/api/incidents/:id/resolve', async (req: Request, res: Response) => {
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
