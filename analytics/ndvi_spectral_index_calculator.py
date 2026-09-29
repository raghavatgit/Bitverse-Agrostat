import numpy as np

def calculate_ndvi(nir_band: np.ndarray, red_band: np.ndarray) -> np.ndarray:
    denominator = nir_band + red_band
    ndvi = np.zeros_like(denominator, dtype=np.float32)
    valid_mask = denominator > 0
    ndvi[valid_mask] = (nir_band[valid_mask] - red_band[valid_mask]) / denominator[valid_mask]
    return np.clip(ndvi, -1.0, 1.0)
