/* Health check route */

import { Router } from 'express';

export const healthRoutes = Router();

healthRoutes.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'ccllottaaWorld Asset Server',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
