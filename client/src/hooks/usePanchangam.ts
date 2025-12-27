/**
 * usePanchangam Hook
 *
 * React hook for fetching and managing Panchangam data.
 */

import { useState, useCallback } from 'react';
import { PanchangamRequest, PanchangamResponse } from '../types/panchangam';
import { fetchPanchangam } from '../services/panchangamApi';

interface UsePanchangamResult {
  data: PanchangamResponse | null;
  loading: boolean;
  error: string | null;
  calculate: (request: PanchangamRequest) => Promise<void>;
}

export function usePanchangam(): UsePanchangamResult {
  const [data, setData] = useState<PanchangamResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (request: PanchangamRequest) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchPanchangam(request);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, calculate };
}
