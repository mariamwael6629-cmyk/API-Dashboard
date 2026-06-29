import asyncio
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.integrations.registry import get_adapter
from app.models.connection import Connection
from app.models.unified_endpoint import UnifiedEndpoint
from app.schemas.aggregation import UnifiedEndpointCreate, UnifiedEndpointUpdate


async def list_endpoints(db: AsyncSession, owner_id: int) -> list[UnifiedEndpoint]:
    result = await db.scalars(
        select(UnifiedEndpoint).where(UnifiedEndpoint.owner_id == owner_id).order_by(UnifiedEndpoint.id)
    )
    return list(result.all())


async def create_endpoint(db: AsyncSession, owner_id: int, payload: UnifiedEndpointCreate) -> UnifiedEndpoint:
    endpoint = UnifiedEndpoint(
        owner_id=owner_id,
        name=payload.name,
        source_connections=payload.source_connections,
        transform_config=payload.transform_config,
    )
    db.add(endpoint)
    await db.commit()
    await db.refresh(endpoint)
    return endpoint


async def get_endpoint_or_404(db: AsyncSession, owner_id: int, endpoint_id: int) -> UnifiedEndpoint:
    endpoint = await db.scalar(
        select(UnifiedEndpoint).where(UnifiedEndpoint.id == endpoint_id, UnifiedEndpoint.owner_id == owner_id)
    )
    if endpoint is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unified endpoint not found")
    return endpoint


async def update_endpoint(
    db: AsyncSession, owner_id: int, endpoint_id: int, payload: UnifiedEndpointUpdate
) -> UnifiedEndpoint:
    endpoint = await get_endpoint_or_404(db, owner_id, endpoint_id)

    if payload.name is not None:
        endpoint.name = payload.name
    if payload.source_connections is not None:
        endpoint.source_connections = payload.source_connections
    if payload.transform_config is not None:
        endpoint.transform_config = payload.transform_config

    await db.commit()
    await db.refresh(endpoint)
    return endpoint


async def delete_endpoint(db: AsyncSession, owner_id: int, endpoint_id: int) -> None:
    endpoint = await get_endpoint_or_404(db, owner_id, endpoint_id)
    await db.delete(endpoint)
    await db.commit()


def _apply_transform(data: dict[str, Any], rename_map: dict[str, str]) -> dict[str, Any]:
    """Simple field-renaming transform: {old_key: new_key}."""
    if not rename_map:
        return data
    transformed = dict(data)
    for old_key, new_key in rename_map.items():
        if old_key in transformed:
            transformed[new_key] = transformed.pop(old_key)
    return transformed


async def execute_endpoint(db: AsyncSession, owner_id: int, endpoint_id: int) -> dict[str, Any]:
    endpoint = await get_endpoint_or_404(db, owner_id, endpoint_id)

    if not endpoint.source_connections:
        return {"endpoint_id": endpoint.id, "combined": {}, "sources": []}

    result = await db.scalars(
        select(Connection).where(
            Connection.id.in_(endpoint.source_connections), Connection.owner_id == owner_id
        )
    )
    connections = list(result.all())

    async def _fetch(connection: Connection) -> dict[str, Any]:
        adapter = get_adapter(connection.provider)
        payload = await adapter.sample_request(connection.credentials or {})
        return {
            "connection_id": connection.id,
            "provider": connection.provider,
            "name": connection.name,
            **payload,
        }

    sources = await asyncio.gather(*(_fetch(c) for c in connections))

    rename_map = (endpoint.transform_config or {}).get("rename", {})
    merge_field = (endpoint.transform_config or {}).get("merge_field", "data")

    combined: dict[str, Any] = {}
    for source in sources:
        provider_data = source.get("data", source.get("error"))
        combined[source["provider"]] = _apply_transform(
            {merge_field: provider_data} if not isinstance(provider_data, dict) else provider_data,
            rename_map,
        )

    return {"endpoint_id": endpoint.id, "combined": combined, "sources": sources}
