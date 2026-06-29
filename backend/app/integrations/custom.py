import random
import time
from typing import Any

import httpx

PROVIDER = "custom"


async def test_connection(credentials: dict[str, Any]) -> dict[str, Any]:
    """Custom connections point at an arbitrary base_url the user configures.

    If a base_url is provided we attempt a real request; otherwise we mock.
    """
    start = time.perf_counter()
    base_url = credentials.get("base_url")

    if not base_url:
        latency = round(random.uniform(80, 200), 1)
        return {
            "ok": True,
            "status": "connected",
            "detail": "Mock mode: no base_url configured for this custom connection, simulated a handshake.",
            "latency_ms": latency,
            "mock": True,
        }

    headers = credentials.get("headers") or {}
    if credentials.get("api_key"):
        headers.setdefault("Authorization", f"Bearer {credentials['api_key']}")

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(base_url, headers=headers)
        latency = round((time.perf_counter() - start) * 1000, 1)
        ok = resp.status_code < 400
        return {
            "ok": ok,
            "status": "connected" if ok else "degraded",
            "detail": f"Custom endpoint responded with HTTP {resp.status_code}",
            "latency_ms": latency,
            "mock": False,
        }
    except httpx.HTTPError as exc:
        latency = round((time.perf_counter() - start) * 1000, 1)
        return {"ok": False, "status": "disconnected", "detail": str(exc), "latency_ms": latency, "mock": False}


async def sample_request(credentials: dict[str, Any], path: str = "") -> dict[str, Any]:
    base_url = credentials.get("base_url")

    if not base_url:
        return {
            "mock": True,
            "provider": PROVIDER,
            "data": {"message": "Simulated response from custom integration (no base_url configured).", "items": []},
        }

    headers = credentials.get("headers") or {}
    if credentials.get("api_key"):
        headers.setdefault("Authorization", f"Bearer {credentials['api_key']}")

    url = base_url.rstrip("/") + "/" + path.lstrip("/") if path else base_url

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, headers=headers)
        try:
            data = resp.json()
        except ValueError:
            data = {"raw": resp.text}
        return {"mock": False, "provider": PROVIDER, "data": data}
    except httpx.HTTPError as exc:
        return {"mock": False, "provider": PROVIDER, "error": str(exc)}
