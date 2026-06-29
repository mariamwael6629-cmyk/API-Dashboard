import random
import time
from typing import Any

import httpx

from app.core.config import settings

PROVIDER = "stripe"
BASE_URL = "https://api.stripe.com/v1"


async def test_connection(credentials: dict[str, Any]) -> dict[str, Any]:
    start = time.perf_counter()
    api_key = credentials.get("api_key") or settings.STRIPE_API_KEY

    if not api_key:
        latency = round(random.uniform(100, 260), 1)
        return {
            "ok": True,
            "status": "connected",
            "detail": "Mock mode: no STRIPE_API_KEY configured, simulated a successful handshake.",
            "latency_ms": latency,
            "mock": True,
        }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{BASE_URL}/balance", auth=(api_key, ""))
        latency = round((time.perf_counter() - start) * 1000, 1)
        ok = resp.status_code < 400
        return {
            "ok": ok,
            "status": "connected" if ok else "degraded",
            "detail": f"Stripe responded with HTTP {resp.status_code}",
            "latency_ms": latency,
            "mock": False,
        }
    except httpx.HTTPError as exc:
        latency = round((time.perf_counter() - start) * 1000, 1)
        return {"ok": False, "status": "disconnected", "detail": str(exc), "latency_ms": latency, "mock": False}


async def sample_request(credentials: dict[str, Any], path: str = "") -> dict[str, Any]:
    api_key = credentials.get("api_key") or settings.STRIPE_API_KEY

    if not api_key:
        return {
            "mock": True,
            "provider": PROVIDER,
            "data": {
                "object": "list",
                "url": "/v1/charges",
                "has_more": False,
                "data": [
                    {
                        "id": "ch_mock_1A2b3C",
                        "object": "charge",
                        "amount": 4999,
                        "currency": "usd",
                        "status": "succeeded",
                        "customer": "cus_mock123",
                        "created": 1719500000,
                    }
                ],
            },
        }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(f"{BASE_URL}/charges", auth=(api_key, ""), params={"limit": 5})
        return {"mock": False, "provider": PROVIDER, "data": resp.json()}
    except httpx.HTTPError as exc:
        return {"mock": False, "provider": PROVIDER, "error": str(exc)}
