import asyncio

class AgroMqttClient:
    def __init__(self, broker: str, port: int):
        self.broker = broker
        self.port = port
