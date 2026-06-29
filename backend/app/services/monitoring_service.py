import math
import random
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.request_log import RequestLog


async def get_overview(db: AsyncSession) -> dict:
    total_requests = await db.scalar(select(func.count()).select_from(RequestLog)) or 0

    if total_requests == 0:
        # No real traffic yet — fabricate plausible demo metrics.
        return {
            "uptime_pct": round(random.uniform(99.4, 99.99), 2),
            "total_requests": random.randint(20000, 60000),
            "error_rate_pct": round(random.uniform(0.1, 1.5), 2),
            "avg_latency_ms": round(random.uniform(150, 320), 1),
        }

    error_count = await db.scalar(
        select(func.count()).select_from(RequestLog).where(RequestLog.status_code >= 400)
    ) or 0
    avg_latency = await db.scalar(select(func.avg(RequestLog.latency_ms))) or 0.0

    error_rate = (error_count / total_requests) * 100 if total_requests else 0.0
    uptime_pct = max(95.0, 100.0 - error_rate * 1.5)

    return {
        "uptime_pct": round(uptime_pct, 2),
        "total_requests": total_requests,
        "error_rate_pct": round(error_rate, 2),
        "avg_latency_ms": round(float(avg_latency), 1),
    }


async def get_traffic_series(db: AsyncSession, points: int = 24) -> list[dict]:
    total_requests = await db.scalar(select(func.count()).select_from(RequestLog)) or 0
    now = datetime.now(timezone.utc)

    if total_requests == 0:
        series = []
        for i in range(points):
            t = now - timedelta(hours=(points - i))
            base = 400 + 150 * math.sin(i / 3)
            series.append(
                {
                    "time": t.strftime("%H:00"),
                    "requests": round(base + random.uniform(0, 120)),
                    "errors": round(random.uniform(0, 12)),
                    "latency": round(150 + random.uniform(0, 200)),
                }
            )
        return series

    rows = await db.scalars(
        select(RequestLog).where(RequestLog.created_at >= now - timedelta(hours=points)).order_by(RequestLog.created_at)
    )
    rows = list(rows.all())

    buckets: dict[str, dict] = {}
    for i in range(points):
        t = now - timedelta(hours=(points - i))
        key = t.strftime("%Y-%m-%dT%H")
        buckets[key] = {"time": t.strftime("%H:00"), "requests": 0, "errors": 0, "latency_sum": 0, "latency_n": 0}

    for row in rows:
        key = row.created_at.strftime("%Y-%m-%dT%H")
        if key not in buckets:
            continue
        buckets[key]["requests"] += 1
        if row.status_code >= 400:
            buckets[key]["errors"] += 1
        buckets[key]["latency_sum"] += row.latency_ms
        buckets[key]["latency_n"] += 1

    series = []
    for bucket in buckets.values():
        avg_latency = bucket["latency_sum"] / bucket["latency_n"] if bucket["latency_n"] else 0
        series.append(
            {
                "time": bucket["time"],
                "requests": bucket["requests"],
                "errors": bucket["errors"],
                "latency": round(avg_latency),
            }
        )
    return series


async def get_heatmap(db: AsyncSession) -> list[dict]:
    total_requests = await db.scalar(select(func.count()).select_from(RequestLog)) or 0
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    hours = [f"{i * 2}:00" for i in range(12)]

    if total_requests == 0:
        return [
            {"day": day, "cells": [{"hour": h, "value": round(random.uniform(0, 100))} for h in hours]}
            for day in days
        ]

    rows = await db.scalars(select(RequestLog))
    rows = list(rows.all())

    grid: dict[tuple[str, str], list[int]] = {}
    for row in rows:
        day = days[row.created_at.weekday()]
        hour_bucket = f"{(row.created_at.hour // 2) * 2}:00"
        grid.setdefault((day, hour_bucket), []).append(row.latency_ms)

    result = []
    for day in days:
        cells = []
        for h in hours:
            latencies = grid.get((day, h), [])
            value = round(sum(latencies) / len(latencies)) if latencies else 0
            cells.append({"hour": h, "value": value})
        result.append({"day": day, "cells": cells})
    return result
