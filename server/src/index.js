/* ============================================
   ccllottaaWorld — Asset Generation Server
   Express backend serving compressed .glb files
   ============================================ */

import express from 'express';
import cors from 'cors';
import { healthRoutes } from './routes/health.js';
import { assetRoutes } from './routes/assets.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
}));
app.use(express.json());

// Static serving of generated assets
app.use('/output', express.static('output'));

// Routes
app.use('/api', healthRoutes);
app.use('/api/assets', assetRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start
app.listen(PORT, () => {
    console.log(`[ccllottaaWorld Server] Running on http://localhost:${PORT}`);
    console.log(`[ccllottaaWorld Server] Asset endpoint: http://localhost:${PORT}/api/assets/:type/:id`);
});

export default app;
