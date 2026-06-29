import random
import time
from typing import Any

import httpx

from app.core.config import settings

PROVIDER = "google"
BASE_URL = "https://www.googleapis.com"


async def test_connection(credentials: dict[str, Any]) -> dict[str, Any]:
    start = time.perf_counter()
    token = credentials.get("access_token") or credentials.get("api_key")

    if not token:
        latency = round(random.uniform(100, 240), 1)
        return {
            "ok": True,
            "status": "connected",
            "detail": "Mock mode: no Google token configured, simulated a successful handshake.",
            "latency_ms": latency,
            "mock": True,
        }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{BASE_URL}/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token}"},
            )
        latency = round((time.perf_counter() - start) * 1000, 1)
        ok = resp.status_code < 400
        return {
            "ok": ok,
            "status": "connected" if ok else "degraded",
            "detail": f"Google responded with HTTP {resp.status_code}",
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
                "email": "demo.user@nexora.dev",
                "verified_email": True,
                "name": "Demo User",
                "picture": "https://example.com/mock-avatar.png",
            },
        }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{BASE_URL}/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token}"},
            )
        return {"mock": False, "provider": PROVIDER, "data": resp.json()}
    except httpx.HTTPError as exc:
        return {"mock": False, "provider": PROVIDER, "error": str(exc)}
