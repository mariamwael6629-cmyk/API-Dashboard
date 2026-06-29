import json
import random
import time
from typing import Any
from urllib.parse import urlparse

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.request_log import RequestLog
from app.schemas.testing import TestRunRequest

EXTERNAL_SCHEMES = {"http", "https"}


def _looks_external(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in EXTERNAL_SCHEMES and bool(parsed.netloc)


def _generate_snippets(payload: TestRunRequest) -> dict[str, str]:
    method = payload.method.upper()
    headers = payload.headers or {}
    body = payload.body

    header_flags = " ".join(f"-H '{k}: {v}'" for k, v in headers.items())
    curl_body = f" -d '{json.dumps(body)}'" if body else ""
    curl = f"curl -X {method} '{payload.url}' {header_flags}{curl_body}".strip()

    js_headers = json.dumps(headers) if headers else "{}"
    js_body = f",\n  body: JSON.stringify({json.dumps(body)})" if body else ""
    javascript = (
        f"fetch('{payload.url}', {{\n"
        f"  method: '{method}',\n"
        f"  headers: {js_headers}{js_body}\n"
        f"}})\n  .then((res) => res.json())\n  .then(console.log);"
    )

    py_headers = repr(headers) if headers else "{}"
    py_body = f", json={body!r}" if body else ""
    python = (
        f"import requests\n\n"
        f"resp = requests.request('{method}', '{payload.url}', headers={py_headers}{py_body})\n"
        f"print(resp.status_code, resp.json())"
    )

    return {"curl": curl, "javascript": javascript, "python": python}


async def run_test(db: AsyncSession, payload: TestRunRequest) -> dict[str, Any]:
    start = time.perf_counter()

    if _looks_external(payload.url):
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.request(
                    payload.method.upper(), payload.url, headers=payload.headers, json=payload.body
                )
            latency_ms = int((time.perf_counter() - start) * 1000)
            try:
                body = resp.json()
            except ValueError:
                body = resp.text
            status_code = resp.status_code
            response_headers = dict(resp.headers)
            simulated = False
        except httpx.HTTPError as exc:
            latency_ms = int((time.perf_counter() - start) * 1000)
            status_code = 502
            body = {"error": str(exc)}
            response_headers = {}
            simulated = False
    else:
        # No real network target — simulate a realistic response.
        latency_ms = random.randint(60, 420)
        status_code = random.choice([200, 200, 200, 201, 400, 404])
        body = {
            "simulated": True,
            "message": "Simulated response (URL not recognized as an external host).",
            "method": payload.method.upper(),
            "url": payload.url,
            "echo_body": payload.body,
        }
        response_headers = {"content-type": "application/json"}
        simulated = True

    db.add(
        RequestLog(
            connection_id=payload.connection_id,
            method=payload.method.upper(),
            path=payload.url,
            status_code=status_code,
            latency_ms=latency_ms,
        )
    )
    await db.commit()

    snippets = _generate_snippets(payload)

    return {
        "status_code": status_code,
        "latency_ms": latency_ms,
        "headers": response_headers,
        "body": body,
        "simulated": simulated,
        "snippets": snippets,
    }
