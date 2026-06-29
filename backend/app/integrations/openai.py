import random
import time
from typing import Any

import httpx

from app.core.config import settings

PROVIDER = "openai"
BASE_URL = "https://api.openai.com/v1"


def _is_live() -> bool:
    return bool(settings.OPENAI_API_KEY)


async def test_connection(credentials: dict[str, Any]) -> dict[str, Any]:
    start = time.perf_counter()
    api_key = credentials.get("api_key") or settings.OPENAI_API_KEY

    if not api_key:
        latency = round(random.uniform(120, 280), 1)
        return {
            "ok": True,
            "status": "connected",
            "detail": "Mock mode: no OPENAI_API_KEY configured, simulated a successful handshake.",
            "latency_ms": latency,
            "mock": True,
        }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{BASE_URL}/models",
                headers={"Authorization": f"Bearer {api_key}"},
            )
        latency = round((time.perf_counter() - start) * 1000, 1)
        ok = resp.status_code < 400
        return {
            "ok": ok,
            "status": "connected" if ok else "degraded",
            "detail": f"OpenAI responded with HTTP {resp.status_code}",
            "latency_ms": latency,
            "mock": False,
        }
    except httpx.HTTPError as exc:
        latency = round((time.perf_counter() - start) * 1000, 1)
        return {"ok": False, "status": "disconnected", "detail": str(exc), "latency_ms": latency, "mock": False}


async def sample_request(credentials: dict[str, Any], path: str = "") -> dict[str, Any]:
    api_key = credentials.get("api_key") or settings.OPENAI_API_KEY

    if not api_key:
        return {
            "mock": True,
            "provider": PROVIDER,
            "data": {
                "id": "chatcmpl-mock123",
                "object": "chat.completion",
                "model": "gpt-4o-mini",
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": "This is a simulated OpenAI response (mock mode, no API key configured).",
                        },
                        "finish_reason": "stop",
                    }
                ],
                "usage": {"prompt_tokens": 24, "completion_tokens": 18, "total_tokens": 42},
            },
        }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                f"{BASE_URL}/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": "Say hello from Nexora."}],
                    "max_tokens": 30,
                },
            )
        return {"mock": False, "provider": PROVIDER, "data": resp.json()}
    except httpx.HTTPError as exc:
        return {"mock": False, "provider": PROVIDER, "error": str(exc)}
