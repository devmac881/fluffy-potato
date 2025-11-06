import React, { createContext, useContext, useMemo } from 'react';
import mapboxgl, { type Map as MapboxMap } from 'mapbox-gl';

const token = import.meta.env.VITE_MAPBOX_TOKEN ?? '';
if (!token) {
  console.warn('Mapbox token is not set. Please configure VITE_MAPBOX_TOKEN in your environment.');
}
mapboxgl.accessToken = token;

interface MapboxContextValue {
  mapboxgl: typeof mapboxgl;
  createMap: (options: mapboxgl.MapboxOptions) => MapboxMap;
}

const MapboxContext = createContext<MapboxContextValue | null>(null);

export const MapboxProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const value = useMemo<MapboxContextValue>(() => ({
    mapboxgl,
    createMap: (options) => new mapboxgl.Map(options),
  }), []);

  return <MapboxContext.Provider value={value}>{children}</MapboxContext.Provider>;
};

export const useMapbox = (): MapboxContextValue => {
  const context = useContext(MapboxContext);
  if (!context) {
    throw new Error('useMapbox must be used within a MapboxProvider');
  }
  return context;
};
