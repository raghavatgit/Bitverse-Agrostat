from typing import Dict, Any, Optional

def evaluate_frost_warning(temp_celsius: float, humidity_percent: float) -> Optional[Dict[str, Any]]:
    # Frost risk if temperature approaches freezing and humidity is high
    if temp_celsius <= 1.5 and humidity_percent >= 85.0:
        return {
            'level': 'CRITICAL',
            'alert': 'FROST_WARNING_IMMINENT',
            'suggested_action': 'ACTIVATE_CANOPY_SPRINKLERS'
        }
    return None
