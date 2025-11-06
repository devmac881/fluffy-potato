import React from 'react';
import type { ReachableNode } from '../utils/graph';
import { buildReachabilityGeoJSON } from '../utils/graph';
import './ExportControls.css';

interface ExportControlsProps {
  reachableNodes: ReachableNode[];
  disabled?: boolean;
}

const ExportControls: React.FC<ExportControlsProps> = ({ reachableNodes, disabled = false }) => {
  const handleDownload = () => {
    const geojson = buildReachabilityGeoJSON(reachableNodes);
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coverage.geojson';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-controls">
      <button type="button" onClick={handleDownload} disabled={disabled || reachableNodes.length === 0}>
        Download coverage GeoJSON
      </button>
    </div>
  );
};

export default ExportControls;
