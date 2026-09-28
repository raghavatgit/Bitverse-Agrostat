import numpy as np

def detect_sensor_anomaly(readings: list[float], window_size: int = 30) -> bool:
    if len(readings) < window_size: return False
    w = readings[-window_size:]
    mean = np.mean(w)
    std = np.std(w)
    return abs(readings[-1] - mean) > 3.0 * std if std > 0 else False
