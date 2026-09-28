def raw_voltage_to_vwc(voltage_mv: float) -> float:
    # Volumetric Water Content calculation
    return max(0.0, min(100.0, (voltage_mv - 400.0) / 16.0))
