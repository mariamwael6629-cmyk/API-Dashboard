from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.integrations.registry import get_adapter
from app.models.connection import Connection
from app.models.request_log import RequestLog
from app.schemas.connection import ConnectionCreate, ConnectionUpdate

VALID_PROVIDERS = {"openai", "stripe", "github", "slack", "discord", "google", "custom"}


def mask_credentials(credentials: dict[str, Any]) -> dict[str, Any]:
    """Never return raw secrets — mask everything except non-sensitive hints like base_url."""
    masked: dict[str, Any] = {}
    safe_keys = {"base_url", "headers"}
    for key, value in (credentials or {}).items():
        if key in safe_keys:
            masked[key] = value
            continue
        if isinstance(value, str) and value:
            masked[key] = f"{'*' * max(len(value) - 4, 4)}{value[-4:]}"
        elif value:
            masked[key] = "****"
    return masked


async def list_connections(db: AsyncSession, owner_id: int) -> list[Connection]:
    result = await db.scalars(select(Connection).where(Connection.owner_id == owner_id).order_by(Connection.id))
    return list(result.all())


async def create_connection(db: AsyncSession, owner_id: int, payload: ConnectionCreate) -> Connection:
    provider = payload.provider.lower()
    if provider not in VALID_PROVIDERS:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Unsupported provider '{provider}'")

    connection = Connection(
        owner_id=owner_id,
        provider=provider,
        name=payload.name,
        auth_type=payload.auth_type,
        credentials=payload.credentials or {},
        status="connected" if payload.credentials else "disconnected",
        rate_limit_used=0,
        rate_limit_limit=10000,
    )
    db.add(connection)
    await db.commit()
    await db.refresh(connection)
    return connection


async def get_connection_or_404(db: AsyncSession, owner_id: int, connection_id: int) -> Connection:
    connection = await db.scalar(
        select(Connection).where(Connection.id == connection_id, Connection.owner_id == owner_id)
    )
    if connection is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Connection not found")
    return connection


async def update_connection(
    db: AsyncSession, owner_id: int, connection_id: int, payload: ConnectionUpdate
) -> Connection:
    connection = await get_connection_or_404(db, owner_id, connection_id)

    if payload.name is not None:
        connection.name = payload.name
    if payload.status is not None:
        connection.status = payload.status
    if payload.credentials is not None:
        connection.credentials = payload.credentials
    if payload.rate_limit_used is not None:
        connection.rate_limit_used = payload.rate_limit_used
    if payload.rate_limit_limit is not None:
        connection.rate_limit_limit = payload.rate_limit_limit

    await db.commit()
    await db.refresh(connection)
    return connection


async def delete_connection(db: AsyncSession, owner_id: int, connection_id: int) -> None:
    connection = await get_connection_or_404(db, owner_id, connection_id)
    await db.delete(connection)
    await db.commit()


async def test_connection(db: AsyncSession, owner_id: int, connection_id: int) -> dict[str, Any]:
    connection = await get_connection_or_404(db, owner_id, connection_id)
    adapter = get_adapter(connection.provider)
    result = await adapter.test_connection(connection.credentials or {})

    connection.status = result.get("status", "disconnected")
    await db.commit()

    db.add(
        RequestLog(
            connection_id=connection.id,
            method="GET",
            path=f"/integrations/{connection.provider}/test",
            status_code=200 if result.get("ok") else 502,
            latency_ms=int(result.get("latency_ms", 0)),
        )
    )
    await db.commit()

    return result


async def list_logs(
    db: AsyncSession, owner_id: int, connection_id: int, page: int = 1, page_size: int = 20
) -> tuple[list[RequestLog], int]:
    await get_connection_or_404(db, owner_id, connection_id)

    total = await db.scalar(
        select(func.count()).select_from(RequestLog).where(RequestLog.connection_id == connection_id)
    )
    result = await db.scalars(
        select(RequestLog)
        .where(RequestLog.connection_id == connection_id)
        .order_by(RequestLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    return list(result.all()), total or 0
