from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.workflow import Workflow
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate


async def list_workflows(db: AsyncSession, owner_id: int) -> list[Workflow]:
    result = await db.scalars(select(Workflow).where(Workflow.owner_id == owner_id).order_by(Workflow.id))
    return list(result.all())


async def create_workflow(db: AsyncSession, owner_id: int, payload: WorkflowCreate) -> Workflow:
    workflow = Workflow(owner_id=owner_id, name=payload.name, nodes=payload.nodes, status=payload.status)
    db.add(workflow)
    await db.commit()
    await db.refresh(workflow)
    return workflow


async def get_workflow_or_404(db: AsyncSession, owner_id: int, workflow_id: int) -> Workflow:
    workflow = await db.scalar(select(Workflow).where(Workflow.id == workflow_id, Workflow.owner_id == owner_id))
    if workflow is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    return workflow


async def update_workflow(db: AsyncSession, owner_id: int, workflow_id: int, payload: WorkflowUpdate) -> Workflow:
    workflow = await get_workflow_or_404(db, owner_id, workflow_id)

    if payload.name is not None:
        workflow.name = payload.name
    if payload.nodes is not None:
        workflow.nodes = payload.nodes
    if payload.status is not None:
        workflow.status = payload.status

    await db.commit()
    await db.refresh(workflow)
    return workflow


async def delete_workflow(db: AsyncSession, owner_id: int, workflow_id: int) -> None:
    workflow = await get_workflow_or_404(db, owner_id, workflow_id)
    await db.delete(workflow)
    await db.commit()
