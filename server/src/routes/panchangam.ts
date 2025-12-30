/**
 * Panchangam API Routes
 *
 * Defines the REST API endpoints for Panchangam calculations.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { panchangamController } from '../controllers/panchangamController.js';
import { PanchangamResponse } from '../types/panchangam.js';

export const panchangamRouter = Router();

// Request validation schema using Zod
const panchangamRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1, 'Timezone is required'),
  birthNakshatra: z.string().optional(),
});

// Date range request schema for CSV export
const dateRangeRequestSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1, 'Timezone is required'),
  birthNakshatra: z.string().optional(),
});

/**
 * POST /api/panchangam
 *
 * Calculate complete Panchangam for a given date and location.
 */
panchangamRouter.post('/panchangam', async (req: Request, res: Response) => {
  try {
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
 */
panchangamRouter.get('/panchangam/today', async (_req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await panchangamController.calculate({
      date: today!,
      latitude: 13.0827,
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

/**
 * POST /api/panchangam/range
 *
 * Calculate Panchangam for a date range and return as JSON array.
 */
panchangamRouter.post('/panchangam/range', async (req: Request, res: Response) => {
  try {
    const validationResult = dateRangeRequestSchema.safeParse(req.body);

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

    const { startDate, endDate, latitude, longitude, timezone, birthNakshatra } = validationResult.data;

    // Validate date range (max 365 days)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      res.status(400).json({ error: 'End date must be after start date' });
      return;
    }
    if (daysDiff > 365) {
      res.status(400).json({ error: 'Date range cannot exceed 365 days' });
      return;
    }

    // Calculate Panchangam for each day
    const results: PanchangamResponse[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0]!;
      const result = await panchangamController.calculate({
        date: dateStr,
        latitude,
        longitude,
        timezone,
        birthNakshatra,
      });
      results.push(result);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json(results);

  } catch (error) {
    console.error('Panchangam range calculation error:', error);
    res.status(500).json({
      error: 'Calculation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/panchangam/csv
 *
 * Calculate Panchangam for a date range and download as CSV file.
 */
panchangamRouter.post('/panchangam/csv', async (req: Request, res: Response) => {
  try {
    const validationResult = dateRangeRequestSchema.safeParse(req.body);

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

    const { startDate, endDate, latitude, longitude, timezone, birthNakshatra } = validationResult.data;

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      res.status(400).json({ error: 'End date must be after start date' });
      return;
    }
    if (daysDiff > 365) {
      res.status(400).json({ error: 'Date range cannot exceed 365 days' });
      return;
    }

    // CSV Header
    const csvHeader = [
      'Date',
      'Tamil Month',
      'Tamil Day',
      'Tamil Year',
      'Sunrise',
      'Sunset',
      'Tithi',
      'Tithi End',
      'Nakshatra',
      'Nakshatra Pada',
      'Nakshatra End',
      'Yoga',
      'Yoga End',
      'Karana',
      'Karana End',
      'Moon Rasi',
      'Moon Degree',
      'Rahu Kalam Start',
      'Rahu Kalam End',
      'Yama Gandam Start',
      'Yama Gandam End',
      'Kuligai Start',
      'Kuligai End',
      'Festivals'
    ].join(',');

    const csvRows: string[] = [csvHeader];
    const currentDate = new Date(startDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0]!;
      const result = await panchangamController.calculate({
        date: dateStr,
        latitude,
        longitude,
        timezone,
        birthNakshatra,
      });

      // Build CSV row
      const row = [
        result.date,
        result.tamilCalendar.month.en,
        result.tamilCalendar.day,
        result.tamilCalendar.year.name.en,
        result.sunrise,
        result.sunset,
        `${result.tithi.name.en} (${result.tithi.paksha.en})`,
        result.tithi.endTime,
        result.nakshatra.name.en,
        result.nakshatra.pada,
        result.nakshatra.endTime,
        result.yoga.name.en,
        result.yoga.endTime,
        result.karana.name.en,
        result.karana.endTime,
        result.moonRasi.name.en,
        result.moonRasi.degree.toFixed(2),
        result.inauspiciousPeriods.rahuKalam.start,
        result.inauspiciousPeriods.rahuKalam.end,
        result.inauspiciousPeriods.yamaGandam.start,
        result.inauspiciousPeriods.yamaGandam.end,
        result.inauspiciousPeriods.kuligai.start,
        result.inauspiciousPeriods.kuligai.end,
        result.festivals.map(f => f.name.en).join('; ') || 'None'
      ].map(v => `"${v}"`).join(',');

      csvRows.push(row);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const csvContent = csvRows.join('\n');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="panchangam_${startDate}_to_${endDate}.csv"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Panchangam CSV export error:', error);
    res.status(500).json({
      error: 'CSV export failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
