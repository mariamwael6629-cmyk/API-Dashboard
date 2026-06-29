from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.env_variable import EnvVariable
from app.schemas.env_variable import EnvVariableCreate, EnvVariableUpdate


async def list_vars(db: AsyncSession, owner_id: int) -> list[EnvVariable]:
    result = await db.scalars(select(EnvVariable).where(EnvVariable.owner_id == owner_id).order_by(EnvVariable.key))
    return list(result.all())


async def create_var(db: AsyncSession, owner_id: int, payload: EnvVariableCreate) -> EnvVariable:
    env_var = EnvVariable(owner_id=owner_id, key=payload.key, value=payload.value)
    db.add(env_var)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Key '{payload.key}' already exists")
    await db.refresh(env_var)
    return env_var


async def get_var_or_404(db: AsyncSession, owner_id: int, var_id: int) -> EnvVariable:
    env_var = await db.scalar(select(EnvVariable).where(EnvVariable.id == var_id, EnvVariable.owner_id == owner_id))
    if env_var is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Environment variable not found")
    return env_var


async def update_var(db: AsyncSession, owner_id: int, var_id: int, payload: EnvVariableUpdate) -> EnvVariable:
    env_var = await get_var_or_404(db, owner_id, var_id)
    env_var.value = payload.value
    await db.commit()
    await db.refresh(env_var)
    return env_var


async def delete_var(db: AsyncSession, owner_id: int, var_id: int) -> None:
    env_var = await get_var_or_404(db, owner_id, var_id)
    await db.delete(env_var)
    await db.commit()
