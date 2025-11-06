import React, { useEffect, useRef } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { NetworkGraph, NetworkNode } from '../types/network';
import type { ReachableNode } from '../utils/graph';
import { buildReachabilityGeoJSON, buildReachableEdges, computeBounds } from '../utils/graph';
import { useMapbox } from '../state/mapbox-context';
import './CoverageMap.css';

interface CoverageMapProps {
  graph: NetworkGraph | undefined;
  reachableNodes: ReachableNode[];
  originNode: NetworkNode | null;
  isLoading: boolean;
}

const EDGE_SOURCE_ID = 'reachable-edges';
const NODE_SOURCE_ID = 'reachable-nodes';
const ORIGIN_SOURCE_ID = 'origin-node';

const CoverageMap: React.FC<CoverageMapProps> = ({ graph, reachableNodes, originNode, isLoading }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { createMap } = useMapbox();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = createMap({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-122.4194, 37.7749],
      zoom: 12,
      cooperativeGestures: true,
    });

    map.on('load', () => {
      map.addSource(EDGE_SOURCE_ID, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
        id: 'reachable-edges-line',
        type: 'line',
        source: EDGE_SOURCE_ID,
        paint: {
          'line-color': ['interpolate', ['linear'], ['get', 'weight'], 0, '#0d9488', 6, '#ef4444'],
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });

      map.addSource(NODE_SOURCE_ID, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
        id: 'reachable-nodes-circle',
        type: 'circle',
        source: NODE_SOURCE_ID,
        paint: {
          'circle-radius': 6,
          'circle-color': ['interpolate', ['linear'], ['get', 'cost'], 0, '#0d9488', 6, '#ef4444'],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      });

      map.addSource(ORIGIN_SOURCE_ID, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
        id: 'origin-marker',
        type: 'circle',
        source: ORIGIN_SOURCE_ID,
        paint: {
          'circle-radius': 10,
          'circle-color': '#1d4ed8',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 3,
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [createMap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateSources = () => {
      const nodesGeoJSON = buildReachabilityGeoJSON(reachableNodes);
      const edgesGeoJSON = {
        type: 'FeatureCollection',
        features: graph ? buildReachableEdges(graph, reachableNodes) : [],
      } as const;

      const originGeoJSON = {
        type: 'FeatureCollection',
        features: originNode
          ? [
              {
                type: 'Feature' as const,
                geometry: { type: 'Point' as const, coordinates: originNode.coordinates },
                properties: { id: originNode.id, name: originNode.name ?? originNode.id },
              },
            ]
          : [],
      } as const;

      (map.getSource(NODE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined)?.setData(
        nodesGeoJSON as any,
      );
      (map.getSource(EDGE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined)?.setData(
        edgesGeoJSON as any,
      );
      (map.getSource(ORIGIN_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined)?.setData(
        originGeoJSON as any,
      );

      if (reachableNodes.length > 0) {
        const bounds = computeBounds(reachableNodes.map((item) => item.node));
        if (bounds) {
          map.fitBounds(bounds as any, { padding: 80, animate: true, duration: 1000 });
        }
      }
    };

    if (map.isStyleLoaded()) {
      updateSources();
      return;
    }

    const handleLoad = () => {
      updateSources();
    };

    map.on('load', handleLoad);

    return () => {
      map.off('load', handleLoad);
    };
  }, [graph, reachableNodes, originNode]);

  return (
    <div className="coverage-map">
      <div
        ref={containerRef}
        className="mapbox-instance"
        aria-busy={isLoading}
        role="application"
        aria-label="Geographic coverage map"
      />
      {isLoading && <div className="loading-overlay">Processing network…</div>}
      {!isLoading && reachableNodes.length === 0 && (
        <div className="empty-state">Select an origin and threshold to compute coverage.</div>
      )}
    </div>
  );
};

export default CoverageMap;
