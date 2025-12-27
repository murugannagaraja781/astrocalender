/**
 * Panchangam API Routes
 *
 * Defines the REST API endpoints for Panchangam calculations.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { panchangamController } from '../controllers/panchangamController.js';

export const panchangamRouter = Router();

// Request validation schema using Zod
const panchangamRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1, 'Timezone is required'),
  birthNakshatra: z.string().optional(),
});

/**
 * POST /api/panchangam
 *
 * Calculate complete Panchangam for a given date and location.
 *
 * @body {date} - Date in YYYY-MM-DD format
 * @body {latitude} - Latitude (-90 to 90)
 * @body {longitude} - Longitude (-180 to 180)
 * @body {timezone} - IANA timezone string (e.g., "Asia/Kolkata")
 * @body {birthNakshatra} - Optional birth nakshatra for Chandrashtamam
 */
panchangamRouter.post('/panchangam', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = panchangamRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    // Calculate Panchangam
    const result = await panchangamController.calculate(validationResult.data);
    res.json(result);

  } catch (error) {
    console.error('Panchangam calculation error:', error);
    res.status(500).json({
      error: 'Calculation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/panchangam/today
 *
 * Get Panchangam for today at a default location (Chennai).
 * Useful for quick testing.
 */
panchangamRouter.get('/panchangam/today', async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await panchangamController.calculate({
      date: today!,
      latitude: 13.0827,  // Chennai
      longitude: 80.2707,
      timezone: 'Asia/Kolkata',
    });
    res.json(result);
  } catch (error) {
    console.error('Panchangam calculation error:', error);
    res.status(500).json({
      error: 'Calculation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
