/**
 * useGeolocation Hook
 *
 * React hook for browser geolocation with manual override.
 */

import { useState, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface UseGeolocationResult {
  location: Location | null;
  loading: boolean;
  error: string | null;
  detectLocation: () => void;
  setLocation: (location: Location) => void;
}

// Default to Chennai, India
const DEFAULT_LOCATION: Location = {
  latitude: 13.0827,
  longitude: 80.2707,
};

export function useGeolocation(): UseGeolocationResult {
  const [location, setLocationState] = useState<Location | null>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let message = 'Failed to detect location';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Location permission denied';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const setLocation = useCallback((newLocation: Location) => {
    setLocationState(newLocation);
    setError(null);
  }, []);

  return { location, loading, error, detectLocation, setLocation };
}
