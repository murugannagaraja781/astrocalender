/**
 * Panchangam Controller
 *
 * Handles API requests for Panchangam calculations.
 * Acts as a thin layer between routes and services.
 */

import { PanchangamRequest, PanchangamResponse } from '../types/panchangam.js';
import { calculatePanchangam } from '../services/panchangamService.js';
import { isValidTimezone } from '../utils/datetime.js';

/**
 * Validate and process Panchangam calculation request.
 */
async function calculate(request: PanchangamRequest): Promise<PanchangamResponse> {
  // Additional validation
  if (!isValidTimezone(request.timezone)) {
    throw new Error(`Invalid timezone: ${request.timezone}`);
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(request.date)) {
    throw new Error('Date must be in YYYY-MM-DD format');
  }

  // Validate coordinates
  if (request.latitude < -90 || request.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (request.longitude < -180 || request.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  // Calculate Panchangam
  return calculatePanchangam(request);
}

export const panchangamController = {
  calculate,
};
