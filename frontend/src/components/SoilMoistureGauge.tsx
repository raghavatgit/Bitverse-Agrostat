import React from 'react';

export interface GaugeProps {
  valuePercent: number;
}

export const SoilMoistureGauge: React.FC<GaugeProps> = ({ valuePercent }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (valuePercent / 100) * circumference;

  return (
    <svg width="100" height="100">
      <circle cx="50" cy="50" r={radius} stroke="#333333" strokeWidth="8" fill="none" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="#00ffff"
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};
