def parse_modbus_soil_frame(frame: bytes) -> dict:
    if len(frame) < 7:
        raise ValueError("Invalid Modbus frame length")
    moisture_raw = int.from_bytes(frame[3:5], byteorder='big')
    temp_raw = int.from_bytes(frame[5:7], byteorder='big')
    return {
        "moisture_percent": moisture_raw / 10.0,
        "temperature_celsius": temp_raw / 10.0
    }
