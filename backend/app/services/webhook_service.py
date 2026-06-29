import itertools
import time
from collections import deque
from datetime import datetime, timezone
from typing import Any

import httpx

from app.schemas.webhook import WebhookTestRequest

# In-memory webhook event log (per-process). Simple and sufficient for a
# demo/testing tool — survives only for the life of the server process.
_EVENT_LOG: deque[dict[str, Any]] = deque(maxlen=200)
_ID_COUNTER = itertools.count(1)


async def fire_webhook(payload: WebhookTestRequest) -> dict[str, Any]:
    start = time.perf_counter()
    error: str | None = None
    status_code: int | None = None
    response_body: Any = None
    ok = False

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.request(
                payload.method.upper(),
                payload.url,
                json=payload.payload,
                headers=payload.headers,
            )
        status_code = resp.status_code
        ok = resp.status_code < 400
        try:
            response_body = resp.json()
        except ValueError:
            response_body = resp.text
    except httpx.HTTPError as exc:
        error = str(exc)

    latency_ms = int((time.perf_counter() - start) * 1000)

    event = {
        "id": next(_ID_COUNTER),
        "url": payload.url,
        "method": payload.method.upper(),
        "status_code": status_code,
        "latency_ms": latency_ms,
        "ok": ok,
        "created_at": datetime.now(timezone.utc),
    }
    _EVENT_LOG.appendleft(event)

    return {
        "ok": ok,
        "status_code": status_code,
        "latency_ms": latency_ms,
        "response_body": response_body,
        "error": error,
    }


def list_events() -> list[dict[str, Any]]:
    return list(_EVENT_LOG)
