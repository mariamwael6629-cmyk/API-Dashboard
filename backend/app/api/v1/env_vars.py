from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.env_variable import EnvVariableCreate, EnvVariableOut, EnvVariableUpdate
from app.services import env_service

router = APIRouter(prefix="/env-vars", tags=["env_vars"])


@router.get("", response_model=list[EnvVariableOut])
async def list_vars(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await env_service.list_vars(db, current_user.id)


@router.post("", response_model=EnvVariableOut, status_code=201)
async def create_var(
    payload: EnvVariableCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return await env_service.create_var(db, current_user.id, payload)


@router.put("/{var_id}", response_model=EnvVariableOut)
async def update_var(
    var_id: int,
    payload: EnvVariableUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await env_service.update_var(db, current_user.id, var_id, payload)


@router.delete("/{var_id}", status_code=204)
async def delete_var(
    var_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    await env_service.delete_var(db, current_user.id, var_id)
    return None
