import struct

def encode_lora_telemetry(node_id: int, battery_pct: int, moisture: float, temp: float) -> bytes:
    return struct.pack(">HBBhh", node_id, battery_pct, 0, int(moisture * 10), int(temp * 10))
