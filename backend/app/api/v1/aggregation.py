from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.aggregation import ExecuteResult, UnifiedEndpointCreate, UnifiedEndpointOut, UnifiedEndpointUpdate
from app.services import aggregation_service

router = APIRouter(prefix="/aggregation", tags=["aggregation"])


@router.get("", response_model=list[UnifiedEndpointOut])
async def list_endpoints(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await aggregation_service.list_endpoints(db, current_user.id)


@router.post("", response_model=UnifiedEndpointOut, status_code=201)
async def create_endpoint(
    payload: UnifiedEndpointCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await aggregation_service.create_endpoint(db, current_user.id, payload)


@router.get("/{endpoint_id}", response_model=UnifiedEndpointOut)
async def get_endpoint(
    endpoint_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return await aggregation_service.get_endpoint_or_404(db, current_user.id, endpoint_id)


@router.put("/{endpoint_id}", response_model=UnifiedEndpointOut)
async def update_endpoint(
    endpoint_id: int,
    payload: UnifiedEndpointUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await aggregation_service.update_endpoint(db, current_user.id, endpoint_id, payload)


@router.delete("/{endpoint_id}", status_code=204)
async def delete_endpoint(
    endpoint_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    await aggregation_service.delete_endpoint(db, current_user.id, endpoint_id)
    return None


@router.post("/{endpoint_id}/execute", response_model=ExecuteResult)
async def execute_endpoint(
    endpoint_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await aggregation_service.execute_endpoint(db, current_user.id, endpoint_id)
    return ExecuteResult(**result)
