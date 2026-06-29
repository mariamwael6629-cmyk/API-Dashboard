from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.workflow import WorkflowCreate, WorkflowOut, WorkflowUpdate
from app.services import workflow_service

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("", response_model=list[WorkflowOut])
async def list_workflows(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await workflow_service.list_workflows(db, current_user.id)


@router.post("", response_model=WorkflowOut, status_code=201)
async def create_workflow(
    payload: WorkflowCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return await workflow_service.create_workflow(db, current_user.id, payload)


@router.get("/{workflow_id}", response_model=WorkflowOut)
async def get_workflow(
    workflow_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return await workflow_service.get_workflow_or_404(db, current_user.id, workflow_id)


@router.put("/{workflow_id}", response_model=WorkflowOut)
async def update_workflow(
    workflow_id: int,
    payload: WorkflowUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await workflow_service.update_workflow(db, current_user.id, workflow_id, payload)


@router.delete("/{workflow_id}", status_code=204)
async def delete_workflow(
    workflow_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    await workflow_service.delete_workflow(db, current_user.id, workflow_id)
    return None
