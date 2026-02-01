import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Orchestrator } from './orchestrator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy Configuration for External Services
// Proxy /api/auth to the VPS API
app.use('/api/auth', createProxyMiddleware({
  target: 'http://76.13.113.206', // Base URL of VPS
  changeOrigin: true,
  secure: false, // Since target is HTTP
}));

// Proxy /api/rights (if needed)
app.use('/api/rights', createProxyMiddleware({
  target: 'http://76.13.113.206',
  changeOrigin: true,
  secure: false,
}));

// Proxy /api/brand (if needed)
app.use('/api/brand', createProxyMiddleware({
  target: 'http://76.13.113.206',
  changeOrigin: true,
  secure: false,
}));

// File upload setup
const upload = multer({ storage: multer.memoryStorage() });

// Orchestrator instance
const orchestrator = new Orchestrator();

// API Endpoints
app.get('/api/orchestrator', async (req, res) => {
  try {
    const data = await orchestrator.getOrchestratorData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/n8n/workflows', async (req, res) => {
  try {
    const workflows = await orchestrator.getN8nWorkflows();
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agents', async (req, res) => {
  try {
    const agent = await orchestrator.createAgent(req.body);
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/slots/assign', (req, res) => {
  try {
    const { slotId, agentId } = req.body;
    const slot = orchestrator.assignAgent(slotId, agentId);
    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/works', upload.single('audioFile'), async (req, res) => {
  try {
    const workData = req.body;
    const file = req.file; // Multer file object
    const work = await orchestrator.createWork(workData, file);
    res.json(work);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const campaign = await orchestrator.createCampaign(req.body);
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/campaigns/:id/trigger', async (req, res) => {
  try {
    const result = await orchestrator.triggerCampaign(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
