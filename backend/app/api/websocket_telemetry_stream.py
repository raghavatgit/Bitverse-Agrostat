from fastapi import WebSocket

class TelemetryConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
