import { useState, useEffect } from 'react';

/**
 * useCountUp hook for smoothly animating numbers when they load or change
 * @param {number} targetValue - Final numeric value to reach
 * @param {number} durationMs - Duration of animation in ms (default 800ms)
 * @param {number} decimals - Number of decimal places (default 0)
 * @returns {number|string}
 */
export function useCountUp(targetValue, durationMs = 800, decimals = 0) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof targetValue !== 'number' || isNaN(targetValue)) {
      return;
    }

    let start = 0;
    const end = targetValue;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Ease out cubic
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOutProgress;

      setDisplayValue(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(decimals > 0 ? Number(end.toFixed(decimals)) : end);
      }
    };

    const frameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, durationMs, decimals]);

  return displayValue;
}
