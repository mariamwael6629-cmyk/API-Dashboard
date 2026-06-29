import random
import time
from typing import Any

import httpx

from app.core.config import settings

PROVIDER = "slack"
BASE_URL = "https://slack.com/api"


async def test_connection(credentials: dict[str, Any]) -> dict[str, Any]:
    start = time.perf_counter()
    token = credentials.get("access_token") or credentials.get("api_key")

    if not token:
        latency = round(random.uniform(90, 220), 1)
        return {
            "ok": True,
            "status": "connected",
            "detail": "Mock mode: no Slack token configured, simulated a successful handshake.",
            "latency_ms": latency,
            "mock": True,
        }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                f"{BASE_URL}/auth.test",
                headers={"Authorization": f"Bearer {token}"},
            )
        latency = round((time.perf_counter() - start) * 1000, 1)
        body = resp.json() if resp.status_code < 500 else {}
        ok = resp.status_code < 400 and body.get("ok", False)
        return {
            "ok": ok,
            "status": "connected" if ok else "degraded",
            "detail": f"Slack responded with HTTP {resp.status_code}",
            "latency_ms": latency,
            "mock": False,
        }
    except httpx.HTTPError as exc:
        latency = round((time.perf_counter() - start) * 1000, 1)
        return {"ok": False, "status": "disconnected", "detail": str(exc), "latency_ms": latency, "mock": False}


async def sample_request(credentials: dict[str, Any], path: str = "") -> dict[str, Any]:
    token = credentials.get("access_token") or credentials.get("api_key")

    if not token:
        return {
            "mock": True,
            "provider": PROVIDER,
            "data": {
                "ok": True,
                "channels": [
                    {"id": "C0123MOCK", "name": "general", "num_members": 18, "is_archived": False},
                    {"id": "C0456MOCK", "name": "engineering", "num_members": 9, "is_archived": False},
                ],
            },
        }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{BASE_URL}/conversations.list",
                headers={"Authorization": f"Bearer {token}"},
                params={"limit": 5},
            )
        return {"mock": False, "provider": PROVIDER, "data": resp.json()}
    except httpx.HTTPError as exc:
        return {"mock": False, "provider": PROVIDER, "error": str(exc)}
