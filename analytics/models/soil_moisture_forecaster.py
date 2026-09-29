from typing import List

class SoilMoistureForecaster:
    def __init__(self, alpha: float = 0.3, beta: float = 0.1):
        self.alpha = alpha
        self.beta = beta

    def forecast_decay(self, series: List[float], horizon_hours: int = 72) -> List[float]:
        if not series:
            return []
        level = series[0]
        trend = 0.0
        for val in series:
            prev_level = level
            level = self.alpha * val + (1 - self.alpha) * (level + trend)
            trend = self.beta * (level - prev_level) + (1 - self.beta) * trend

        forecasts = []
        for h in range(1, horizon_hours + 1):
            forecasts.append(max(0.0, level + h * trend))
        return forecasts
