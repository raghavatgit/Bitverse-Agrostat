def compute_ndvi(nir: float, red: float) -> float:
    denom = nir + red
    if denom == 0:
        return 0.0
    return (nir - red) / denom

def classify_crop_health(ndvi: float) -> str:
    if ndvi >= 0.7:
        return "HEALTHY_DENSE"
    elif ndvi >= 0.4:
        return "MODERATE_VIGOR"
    elif ndvi >= 0.2:
        return "STRESSED_DEFICIT"
    return "BARREN_SOIL"
