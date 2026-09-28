# Industrial IoT Edge Gateway Architecture

## Gateway Components
1. RS485 Modbus Poller daemon running at 1 Hz.
2. Local SQLite Ring buffer for offline storage during cellular dropouts.
3. MQTT publisher with QoS 1 and TLS mutual authentication.
