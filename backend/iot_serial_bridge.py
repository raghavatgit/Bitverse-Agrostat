import time
import json
import random
import re
import sys
import threading
import urllib.request

try:
    import serial
    import serial.tools.list_ports
    SERIAL_AVAILABLE = True
except ImportError:
    SERIAL_AVAILABLE = False

BAUD_RATE = 115200
FIREBASE_RTDB_URL = "https://agrostat-42043-default-rtdb.firebaseio.com/sensorReadings/latest.json"

def push_to_firebase_cloud(packet):
    """Asynchronously syncs the latest telemetry to Firebase Realtime Database."""
    try:
        req = urllib.request.Request(
            FIREBASE_RTDB_URL,
            data=json.dumps(packet).encode('utf-8'),
            method='PUT',
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=2.5) as res:
            pass
    except Exception:
        pass

def fetch_from_firebase_cloud():
    """Fetches the latest live reading directly from Firebase RTDB if ESP32 is running via WiFi."""
    try:
        req = urllib.request.Request(FIREBASE_RTDB_URL, headers={'User-Agent': 'AgrostatBridge/1.0'})
        with urllib.request.urlopen(req, timeout=2.0) as res:
            if res.status == 200:
                data = json.loads(res.read().decode('utf-8'))
                if data and isinstance(data, dict) and data.get("temperature") is not None:
                    return data
    except Exception:
        pass
    return None

def find_esp32_port():
    """Scans USB ports for connected ESP32 / CH340 / CP210x / FTDI / USB-Serial boards."""
    if not SERIAL_AVAILABLE:
        return None
    try:
        ports = list(serial.tools.list_ports.comports())
        for p in ports:
            desc = (p.description or "").lower()
            hwid = (p.hwid or "").lower()
            if any(k in desc or k in hwid for k in ["ch340", "cp210", "usb", "serial", "uart", "ftdi", "silicon labs", "wch"]):
                return p.device
        if ports:
            return ports[0].device
    except Exception:
        pass

    # Direct fallback: probe COM1 to COM30 directly
    for i in range(1, 31):
        port_name = f"COM{i}"
        try:
            test_ser = serial.Serial(port_name, BAUD_RATE, timeout=0.1)
            test_ser.close()
            return port_name
        except Exception:
            pass
    return None

def start_serial_bridge(callback=None):
    """
    Main loop: Reads USB serial from ESP32 with hot-plug auto-reconnect,
    dual JSON + regex text parsing, Firebase RTDB cloud sync, and fallback simulator.
    """
    ser = None
    last_scan_time = 0

    temp = 28.4
    humidity = 62.0
    soil_raw = 2100
    soil_pct = 50
    motion_detected = False

    print("[Agrostat IoT Bridge] Background listener initialized.")

    while True:
        try:
            # 1. Hot-Plug Scanner: If serial is not connected, scan for ESP32 COM port every 3 seconds
            now = time.time()
            if ser is None and (now - last_scan_time > 3.0):
                last_scan_time = now
                port = find_esp32_port()
                if port:
                    try:
                        ser = serial.Serial(port, BAUD_RATE, timeout=2.0)
                        ser.reset_input_buffer()
                        print(f"[Agrostat IoT Bridge] Connected to physical ESP32 on {port} @ {BAUD_RATE} baud.")
                    except (PermissionError, serial.SerialException) as pe:
                        ser = None
                    except Exception as e:
                        ser = None

            # 2. Read from Physical ESP32 if connected via USB
            if ser and ser.is_open:
                try:
                    line = ser.readline().decode('utf-8', errors='ignore').strip()
                    if not line:
                        continue

                    # Direct JSON parsing (supports lines with [TELEMETRY] or other prefixes)
                    if '{' in line and '}' in line:
                        json_candidate = line[line.find('{'):line.rfind('}')+1]
                        try:
                            packet = json.loads(json_candidate)
                            if "timestamp" not in packet:
                                packet["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                            if "motion_detected" not in packet:
                                packet["motion_detected"] = False
                            
                            # Update local state
                            temp = packet.get("temperature", temp)
                            humidity = packet.get("humidity", humidity)
                            soil_raw = packet.get("soil_moisture_raw", soil_raw)
                            soil_pct = packet.get("soil_moisture_pct", soil_pct)
                            motion_detected = packet.get("motion_detected", motion_detected)

                            print(f"[ESP32 Live Stream] {packet}")
                            threading.Thread(target=push_to_firebase_cloud, args=(packet,), daemon=True).start()
                            if callback:
                                callback(packet)
                            continue
                        except json.JSONDecodeError:
                            pass

                    # Human-Readable Text parsing (Regex fallback for custom sketch logs)
                    if "Temperature:" in line or "PIR motion:" in line or "Soil moisture" in line or "*C" in line or "rawSoil" in line:
                        t_match = re.search(r'Temperature:\s*([\d.]+)', line)
                        h_match = re.search(r'Humidity:\s*([\d.]+)', line)
                        s_match = re.search(r'Soil moisture.*:\s*(\d+)', line) or re.search(r'rawSoil.*:\s*(\d+)', line)
                        m_match = "MOTION DETECTED" in line

                        if t_match:
                            temp = float(t_match.group(1))
                        if h_match:
                            humidity = float(h_match.group(1))
                        if s_match:
                            soil_raw = int(s_match.group(1))
                        if "PIR motion:" in line:
                            motion_detected = m_match

                        status = "ALERT" if (temp >= 34.0 or motion_detected) else ("WARNING" if humidity >= 80.0 else "NORMAL")
                        alert_code = "FIELD_INTRUSION" if motion_detected else ("HIGH_HEAT" if temp >= 34.0 else ("HIGH_HUMIDITY" if humidity >= 80.0 else "NONE"))

                        # Calibration: 4095 (completely dry air) to 0 (fully wet/water)
                        soil_pct = max(0, min(100, round(100 - (soil_raw / 4095.0) * 100)))

                        packet = {
                            "device_id": "AGRO_ESP32_NODE_01",
                            "temperature": round(temp, 1),
                            "humidity": round(humidity, 1),
                            "soil_moisture_raw": soil_raw,
                            "soil_moisture_pct": soil_pct,
                            "motion_detected": motion_detected,
                            "heat_index": round(temp + (humidity * 0.1), 1),
                            "status": status,
                            "alert_code": alert_code,
                            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                        }
                        print(f"[ESP32 Text Stream Parsed] {packet}")
                        threading.Thread(target=push_to_firebase_cloud, args=(packet,), daemon=True).start()
                        if callback:
                            callback(packet)

                except (serial.SerialException, serial.SerialTimeoutException, OSError) as disc_err:
                    print(f"[Agrostat IoT Bridge] ESP32 disconnected: {disc_err}. Checking Firebase Cloud...")
                    try:
                        ser.close()
                    except Exception:
                        pass
                    ser = None

            # 3. If USB is not connected, check if ESP32 is actively streaming to Firebase RTDB (fresh within 10s)
            else:
                cloud_data = fetch_from_firebase_cloud()
                use_cloud = False
                if cloud_data and cloud_data.get("device_id") == "agrostat-esp32-node-01":
                    ts_str = cloud_data.get("timestamp", "")
                    # Check if timestamp is fresh (updated within 10 seconds)
                    try:
                        if "T" in ts_str:
                            ts_epoch = time.mktime(time.strptime(ts_str, "%Y-%m-%dT%H:%M:%SZ"))
                            if abs(time.time() - ts_epoch) < 12.0:
                                use_cloud = True
                    except Exception:
                        pass

                if use_cloud:
                    if callback:
                        callback(cloud_data)
                    time.sleep(2.5)
                    continue

                # 4. Fallback when Hardware is Offline: Steady Baseline (No Artificial Waves)
                status = "ALERT" if (soil_pct < 25 or temp >= 35.0) else "NORMAL"
                alert_code = "DRY_SOIL" if soil_pct < 25 else ("HIGH_HEAT" if temp >= 35.0 else "NONE")

                packet = {
                    "device_id": "AGRO_ESP32_NODE_01",
                    "temperature": round(temp, 1),
                    "humidity": round(humidity, 1),
                    "soil_moisture_raw": soil_raw,
                    "soil_moisture_pct": soil_pct,
                    "motion_detected": motion_detected,
                    "heat_index": round(temp + (humidity * 0.1), 1),
                    "status": status,
                    "alert_code": alert_code,
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                }
                if callback:
                    callback(packet)
                time.sleep(2.5)

        except KeyboardInterrupt:
            print("\n[Agrostat IoT Bridge] Stopped.")
            break
        except Exception as e:
            print(f"[Agrostat IoT Bridge Error] {e}")
            time.sleep(2.0)

if __name__ == "__main__":
    start_serial_bridge()
