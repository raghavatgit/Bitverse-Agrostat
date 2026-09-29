import React from 'react';

export const CropStressHeatmap: React.FC<{ rows: number; cols: number }> = ({ rows, cols }) => {
  return (
    <div className="heatmap-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 12px)` }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} style={{ width: 10, height: 10, backgroundColor: '#005500', margin: 1 }} />
      ))}
    </div>
  );
};
