import random
import time
from typing import Any

import httpx

from app.core.config import settings

PROVIDER = "github"
BASE_URL = "https://api.github.com"


def _client_configured() -> bool:
    return bool(settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET)


async def test_connection(credentials: dict[str, Any]) -> dict[str, Any]:
    start = time.perf_counter()
    token = credentials.get("access_token") or credentials.get("api_key")

    if not token:
        latency = round(random.uniform(110, 250), 1)
        return {
            "ok": True,
            "status": "connected",
            "detail": "Mock mode: no GitHub token configured, simulated a successful handshake.",
            "latency_ms": latency,
            "mock": True,
        }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{BASE_URL}/user",
                headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"},
            )
        latency = round((time.perf_counter() - start) * 1000, 1)
        ok = resp.status_code < 400
        return {
            "ok": ok,
            "status": "connected" if ok else "degraded",
            "detail": f"GitHub responded with HTTP {resp.status_code}",
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
            "data": [
                {
                    "id": 123456789,
                    "name": "nexora-dashboard",
                    "full_name": "nexora/nexora-dashboard",
                    "private": False,
                    "stargazers_count": 142,
                    "open_issues_count": 7,
                    "updated_at": "2026-06-20T10:00:00Z",
                }
            ],
        }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{BASE_URL}/user/repos",
                headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"},
                params={"per_page": 5},
            )
        return {"mock": False, "provider": PROVIDER, "data": resp.json()}
    except httpx.HTTPError as exc:
        return {"mock": False, "provider": PROVIDER, "error": str(exc)}
