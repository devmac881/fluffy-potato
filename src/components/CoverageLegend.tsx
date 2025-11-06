import React from 'react';
import './CoverageLegend.css';

const costStops = [
  { label: '0 - 2', color: '#0d9488' },
  { label: '2 - 4', color: '#38bdf8' },
  { label: '4 - 6', color: '#f59e0b' },
  { label: '6+', color: '#ef4444' },
];

const CoverageLegend: React.FC = () => {
  return (
    <div className="coverage-legend">
      <h3>Cost Legend</h3>
      <ul>
        {costStops.map((stop) => (
          <li key={stop.label}>
            <span className="swatch" style={{ background: stop.color }} aria-hidden />
            <span>{stop.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoverageLegend;
