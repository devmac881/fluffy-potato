import React from 'react';
import './MetricsPanel.css';

interface MetricsPanelProps {
  reachableCount: number;
  totalNodes: number;
  threshold: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ reachableCount, totalNodes, threshold }) => {
  const coveragePercent = totalNodes > 0 ? Math.round((reachableCount / totalNodes) * 100) : 0;

  return (
    <div className="metrics-panel" aria-live="polite">
      <h3>Coverage Snapshot</h3>
      <div className="metrics-grid">
        <div>
          <span className="label">Reachable nodes</span>
          <span className="value">{reachableCount}</span>
        </div>
        <div>
          <span className="label">Total nodes</span>
          <span className="value">{totalNodes}</span>
        </div>
        <div>
          <span className="label">Coverage</span>
          <span className="value">{coveragePercent}%</span>
        </div>
        <div>
          <span className="label">Threshold</span>
          <span className="value">{threshold}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
