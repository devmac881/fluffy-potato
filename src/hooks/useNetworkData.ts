import { useQuery } from '@tanstack/react-query';
import type { NetworkGraph, OriginLocation } from '../types/network';

const fetchNetwork = async (): Promise<NetworkGraph> => {
  const data = await import('../../data/network.json');
  return data.default as NetworkGraph;
};

const fetchOrigins = async (): Promise<OriginLocation[]> => {
  const data = await import('../../data/origins.json');
  return data.default as OriginLocation[];
};

export const useNetworkGraph = () =>
  useQuery({
    queryKey: ['network'],
    queryFn: fetchNetwork,
    staleTime: Infinity,
  });

export const useOriginLocations = () =>
  useQuery({
    queryKey: ['origins'],
    queryFn: fetchOrigins,
    staleTime: Infinity,
  });
