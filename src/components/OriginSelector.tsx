import React from 'react';
import type { OriginLocation } from '../types/network';
import { useSettingsStore } from '../state/settings-store';
import './OriginSelector.css';

interface OriginSelectorProps {
  origins: OriginLocation[];
  loading?: boolean;
}

const OriginSelector: React.FC<OriginSelectorProps> = ({ origins, loading = false }) => {
  const selectedOriginId = useSettingsStore((state) => state.selectedOriginId);
  const setSelectedOriginId = useSettingsStore((state) => state.setSelectedOriginId);

  return (
    <div className="origin-selector">
      <label htmlFor="origin-select">Origin Location</label>
      <select
        id="origin-select"
        value={selectedOriginId ?? ''}
        onChange={(event) => setSelectedOriginId(event.target.value || null)}
        disabled={loading || origins.length === 0}
      >
        <option value="" disabled>
          {loading ? 'Loading origins…' : 'Choose an origin'}
        </option>
        {origins.map((origin) => (
          <option key={origin.id} value={origin.nodeId}>
            {origin.name}
          </option>
        ))}
      </select>
      {selectedOriginId === null && <p className="hint">Select an origin to begin analyzing coverage.</p>}
    </div>
  );
};

export default OriginSelector;
