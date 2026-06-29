import asyncio
import random
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websockets.manager import manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/monitoring")
async def ws_monitoring(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            tick = {
                "type": "monitoring_tick",
                "requests": random.randint(5, 80),
                "errors": random.randint(0, 4),
                "latency_ms": round(random.uniform(80, 420), 1),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            await websocket.send_json(tick)
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
