import time
import json
import urllib.request
import sys

BACKEND_URL = "http://127.0.0.1:8000/api/telemetry/push"
FIREBASE_URL = "https://agrostat-42043-default-rtdb.firebaseio.com/sensorReadings/latest.json"

def push_reading(temp=28.5, humidity=62.0, soil_pct=85, motion=False):
    # Dynamic ADC calculation: 0 (100% wet) to 4095 (0% dry)
    soil_raw = int(4095 - (soil_pct / 100.0) * 4095)
    packet = {
        "device_id": "agrostat-esp32-node-01",
        "temperature": temp,
        "humidity": humidity,
        "soil_moisture_raw": soil_raw,
        "soil_moisture_pct": soil_pct,
        "motion_detected": motion,
        "heat_index": round(temp + (humidity * 0.1), 1),
        "status": "NORMAL" if soil_pct >= 30 else "ALERT",
        "alert_code": "NONE" if soil_pct >= 30 else "DRY_SOIL",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    try:
        req = urllib.request.Request(
            BACKEND_URL,
            data=json.dumps(packet).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=2.0) as res:
            print(f"[Live Push -> Localhost:8000] Sent: {soil_pct}% Soil (ADC {soil_raw}) | HTTP {res.status}")
    except Exception as e:
        print(f"[Local Push Error] {e}")

    try:
        req_fb = urllib.request.Request(
            FIREBASE_URL,
            data=json.dumps(packet).encode('utf-8'),
            method='PUT',
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req_fb, timeout=2.0) as res:
            print(f"[Live Push -> Firebase RTDB] Synced: {soil_pct}% Soil | HTTP {res.status}")
    except Exception as e:
        print(f"[Firebase Error] {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        val = int(sys.argv[1])
        print(f"Pushing one-shot reading: {val}%")
        push_reading(soil_pct=val)
    else:
        print("Starting interactive live simulation stream...")
        print("Type a soil percentage (0 to 100) or 'auto' to stream changing values:")
        for pct in [15, 32, 58, 76, 92, 85, 42]:
            push_reading(soil_pct=pct)
            time.sleep(2.5)
