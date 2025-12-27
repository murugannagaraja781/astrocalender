/**
 * Panchangam API Server Entry Point
 *
 * Production-ready Express server for Hindu astrological calendar calculations.
 * Uses Swiss Ephemeris with Lahiri ayanamsa for sidereal calculations.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { panchangamRouter } from './routes/panchangam.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', panchangamRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🌙 Panchangam API Server running on port ${PORT}`);
  console.log(`📅 Health check: http://localhost:${PORT}/health`);
  console.log(`🔮 API endpoint: http://localhost:${PORT}/api/panchangam`);
});

export default app;
