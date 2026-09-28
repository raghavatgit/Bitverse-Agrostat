import struct

def parse_modbus_response(data: bytes):
    if len(data) < 5: return None
    slave_id, func_code, byte_count = struct.unpack('>BBB', data[:3])
    return {'slave': slave_id, 'func': func_code, 'bytes': byte_count}
