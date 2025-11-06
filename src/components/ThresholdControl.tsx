import React from 'react';
import { useSettingsStore } from '../state/settings-store';
import './ThresholdControl.css';

interface ThresholdControlProps {
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

const ThresholdControl: React.FC<ThresholdControlProps> = ({
  min = 0,
  max = 20,
  step = 1,
  label = 'Coverage threshold (cost units)',
}) => {
  const threshold = useSettingsStore((state) => state.threshold);
  const setThreshold = useSettingsStore((state) => state.setThreshold);

  return (
    <div className="threshold-control">
      <label htmlFor="threshold-slider">{label}</label>
      <div className="slider-row">
        <input
          id="threshold-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={threshold}
          onChange={(event) => setThreshold(Number(event.target.value))}
        />
        <span className="value">{threshold}</span>
      </div>
    </div>
  );
};

export default ThresholdControl;
