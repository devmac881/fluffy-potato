import React, { useMemo } from 'react';
import AppShell from './components/AppShell';
import OriginSelector from './components/OriginSelector';
import ThresholdControl from './components/ThresholdControl';
import CoverageLegend from './components/CoverageLegend';
import MetricsPanel from './components/MetricsPanel';
import CoverageMap from './components/CoverageMap';
import ErrorBoundary from './components/ErrorBoundary';
import ExportControls from './components/ExportControls';
import { useNetworkGraph, useOriginLocations } from './hooks/useNetworkData';
import { useSettingsStore } from './state/settings-store';
import { computeReachableNodes } from './utils/graph';

const App: React.FC = () => {
  const { data: graph, isLoading: isGraphLoading, error: graphError } = useNetworkGraph();
  const { data: origins = [], isLoading: isOriginsLoading, error: originsError } = useOriginLocations();
  const selectedOriginId = useSettingsStore((state) => state.selectedOriginId);
  const threshold = useSettingsStore((state) => state.threshold);

  const originNode = useMemo(() => {
    if (!graph || !selectedOriginId) return null;
    return graph.nodes.find((node) => node.id === selectedOriginId) ?? null;
  }, [graph, selectedOriginId]);

  const reachableNodes = useMemo(() => {
    if (!graph || !selectedOriginId) return [];
    return computeReachableNodes(graph, { originId: selectedOriginId, maxCost: threshold });
  }, [graph, selectedOriginId, threshold]);

  const sidebar = (
    <>
      <header>
        <h1>Coverage Explorer</h1>
        <p className="lead">Assess network reach from predefined origins using Mapbox GL JS.</p>
      </header>
      <OriginSelector origins={origins} loading={isOriginsLoading} />
      <ThresholdControl min={0} max={12} step={1} />
      <MetricsPanel
        reachableCount={reachableNodes.length}
        totalNodes={graph?.nodes.length ?? 0}
        threshold={threshold}
      />
      <ExportControls reachableNodes={reachableNodes} disabled={isGraphLoading} />
      <CoverageLegend />
      {(graphError || originsError) && (
        <div className="error-banner" role="alert">
          Unable to load configuration files. Please verify data folder contents.
        </div>
      )}
    </>
  );

  const mapContent = (
    <CoverageMap
      graph={graph}
      reachableNodes={reachableNodes}
      originNode={originNode}
      isLoading={isGraphLoading}
    />
  );

  return (
    <ErrorBoundary>
      <AppShell sidebar={sidebar} map={mapContent} />
    </ErrorBoundary>
  );
};

export default App;
