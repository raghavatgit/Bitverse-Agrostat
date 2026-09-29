import asyncio
from typing import List, Dict, Any

class IngestionWorker:
    def __init__(self, batch_flush_size: int = 50):
        self.queue: asyncio.Queue = asyncio.Queue()
        self.batch_flush_size = batch_flush_size

    async def ingest_packet(self, packet: Dict[str, Any]):
        await self.queue.put(packet)

    async def flush_batch(self) -> List[Dict[str, Any]]:
        batch = []
        while not self.queue.empty() and len(batch) < self.batch_flush_size:
            batch.append(await self.queue.get())
        return batch
