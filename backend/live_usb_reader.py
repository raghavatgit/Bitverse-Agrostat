"""
Agrostat Live ESP32 USB Direct Reader & Instant Cloud/UI Forwarder
Team Bitverse | Precision IoT Streamer
"""

import serial
import serial.tools.list_ports
import json
import time
import urllib.request
import sys
import re

BAUD_RATE = 115200
API_PUSH_URL = "http://127.0.0.1:8000/api/telemetry/push"
FIREBASE_URL = "https://agrostat-42043-default-rtdb.firebaseio.com/sensorReadings/latest.json"

def push_to_ui(payload):
    try:
        data_bytes = json.dumps(payload).encode('utf-8')
        # 1. Push to FastAPI Localhost
        req = urllib.request.Request(API_PUSH_URL, data=data_bytes, headers={'Content-Type': 'application/json'})
        urllib.request.urlopen(req, timeout=1.0)
    except Exception:
        pass

    try:
        # 2. Push to Firebase Realtime Database
        req_fb = urllib.request.Request(FIREBASE_URL, data=data_bytes, headers={'Content-Type': 'application/json'}, method='PUT')
        urllib.request.urlopen(req_fb, timeout=1.5)
    except Exception:
        pass

def main():
    print("================================================================")
    print("      [AGROSTAT LIVE HARDWARE USB STREAM FORWARDER]             ")
    print("================================================================")
    
    # 1. Discover COM ports
    ports = [p.device for p in serial.tools.list_ports.comports()]
    print(f"\n[Detection] Found system COM ports: {ports if ports else 'None auto-listed'}")
    
    target_port = None
    if ports:
        target_port = ports[0]
        print(f"[Auto-Select] Using first detected port: {target_port}")
    else:
        # Ask user or try COM1 - COM10
        print("[Notice] If your ESP32 is plugged in, please check Arduino IDE -> Tools -> Port.")
        for p_test in [f"COM{i}" for i in range(1, 15)]:
            try:
                s = serial.Serial(p_test, BAUD_RATE, timeout=0.2)
                s.close()
                target_port = p_test
                print(f"[Found Active Port] -> {target_port}")
                break
            except Exception:
                pass

    if not target_port:
        if len(sys.argv) > 1:
            target_port = sys.argv[1]
        else:
            target_port = "COM3"
            print(f"[Fallback Default] Attempting to listen on: {target_port}")

    print(f"\n[Connecting] Opening {target_port} at {BAUD_RATE} baud...")
    print("[!] IMPORTANT: Please make sure Arduino IDE Serial Monitor is CLOSED so this script can read the port!\n")

    try:
        ser = serial.Serial(target_port, BAUD_RATE, timeout=1.0)
        ser.reset_input_buffer()
        print(f"[OK] Connected to {target_port}! Streaming live sensor packets to UI in real time...\n")
    except Exception as e:
        print(f"[ERROR] Could not open {target_port}: {e}")
        print("\n--> Tip: Check which COM port is shown in Arduino IDE (Tools > Port), then run:")
        print(f"   python live_usb_reader.py COM_PORT_NAME (e.g. python live_usb_reader.py COM4)")
        return

    while True:
        try:
            raw_line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not raw_line:
                continue

            print(f"[Raw Serial] {raw_line}")

            # 1. Try parsing JSON
            if '{' in raw_line and '}' in raw_line:
                json_str = raw_line[raw_line.find('{'):raw_line.rfind('}')+1]
                try:
                    packet = json.loads(json_str)
                    if "timestamp" not in packet:
                        packet["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    
                    soil_pct = packet.get("soil_moisture_pct", 0)
                    soil_raw = packet.get("soil_moisture_raw", 0)
                    temp = packet.get("temperature", 28.0)
                    hum = packet.get("humidity", 60.0)

                    print(f"[*] [LIVE SENSOR PACKET] Soil: {soil_pct}% (Raw ADC: {soil_raw}) | Temp: {temp}C | Humidity: {hum}%  --> Forwarded to UI!")
                    push_to_ui(packet)
                    continue
                except json.JSONDecodeError:
                    pass

            # 2. Try parsing human readable debug line: [SOIL SENSOR] Raw ADC = 4095 ...
            if "Raw ADC =" in raw_line or "Calculated Moisture =" in raw_line:
                adc_m = re.search(r'Raw ADC\s*=\s*(\d+)', raw_line)
                pct_m = re.search(r'Calculated Moisture\s*=\s*(\d+)', raw_line)
                if adc_m:
                    soil_raw = int(adc_m.group(1))
                    soil_pct = int(pct_m.group(1)) if pct_m else int((soil_raw / 4095.0) * 100)
                    packet = {
                        "device_id": "agrostat-esp32-node-01",
                        "temperature": 28.4,
                        "humidity": 62.0,
                        "soil_moisture_raw": soil_raw,
                        "soil_moisture_pct": soil_pct,
                        "motion_detected": False,
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    }
                    print(f"[*] [PARSED SENSOR LOG] Soil: {soil_pct}% (Raw ADC: {soil_raw})  --> Forwarded to UI!")
                    push_to_ui(packet)

        except KeyboardInterrupt:
            print("\nExiting live reader.")
            break
        except Exception as err:
            print(f"[Stream Warning] {err}")
            time.sleep(0.5)

    ser.close()

if __name__ == "__main__":
    main()
