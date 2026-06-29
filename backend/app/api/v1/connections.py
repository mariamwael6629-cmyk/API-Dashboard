from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.connection import (
    ConnectionCreate,
    ConnectionOut,
    ConnectionTestResult,
    ConnectionUpdate,
    PaginatedLogs,
    RequestLogOut,
)
from app.services import connection_service

router = APIRouter(prefix="/connections", tags=["connections"])


def _to_out(connection) -> ConnectionOut:
    out = ConnectionOut.model_validate(connection)
    out.masked_credentials = connection_service.mask_credentials(connection.credentials or {})
    return out


@router.get("", response_model=list[ConnectionOut])
async def list_connections(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    connections = await connection_service.list_connections(db, current_user.id)
    return [_to_out(c) for c in connections]


@router.post("", response_model=ConnectionOut, status_code=201)
async def create_connection(
    payload: ConnectionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    connection = await connection_service.create_connection(db, current_user.id, payload)
    return _to_out(connection)


@router.get("/{connection_id}", response_model=ConnectionOut)
async def get_connection(
    connection_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    connection = await connection_service.get_connection_or_404(db, current_user.id, connection_id)
    return _to_out(connection)


@router.put("/{connection_id}", response_model=ConnectionOut)
async def update_connection(
    connection_id: int,
    payload: ConnectionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    connection = await connection_service.update_connection(db, current_user.id, connection_id, payload)
    return _to_out(connection)


@router.delete("/{connection_id}", status_code=204)
async def delete_connection(
    connection_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    await connection_service.delete_connection(db, current_user.id, connection_id)
    return None


@router.post("/{connection_id}/test", response_model=ConnectionTestResult)
async def test_connection(
    connection_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await connection_service.test_connection(db, current_user.id, connection_id)
    return ConnectionTestResult(**result)


@router.get("/{connection_id}/logs", response_model=PaginatedLogs)
async def get_logs(
    connection_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    logs, total = await connection_service.list_logs(db, current_user.id, connection_id, page, page_size)
    return PaginatedLogs(
        total=total, page=page, page_size=page_size, items=[RequestLogOut.model_validate(l) for l in logs]
    )
