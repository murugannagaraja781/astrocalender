/**
 * Panchangam API Service
 *
 * Handles communication with the backend API.
 */

import { PanchangamRequest, PanchangamResponse } from '../types/panchangam';

const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Calculate Panchangam for a given date and location.
 */
export async function fetchPanchangam(request: PanchangamRequest): Promise<PanchangamResponse> {
  const response = await fetch(`${API_BASE}/panchangam`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || errorData.error || 'Failed to fetch Panchangam'
    );
  }

  return response.json();
}

/**
 * Get Panchangam for today at default location (Chennai).
 */
export async function fetchTodayPanchangam(): Promise<PanchangamResponse> {
  const response = await fetch(`${API_BASE}/panchangam/today`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || errorData.error || 'Failed to fetch today\'s Panchangam'
    );
  }

  return response.json();
}
