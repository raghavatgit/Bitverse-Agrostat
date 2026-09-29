class SoilMoistureTrendEvaluator:
    def __init__(self, alpha=0.3):
        self.alpha = alpha
        self.smoothed_value = None

    def update(self, current_reading: float) -> float:
        if self.smoothed_value is None:
            self.smoothed_value = current_reading
        else:
            self.smoothed_value = self.alpha * current_reading + (1 - self.alpha) * self.smoothed_value
        return self.smoothed_value
