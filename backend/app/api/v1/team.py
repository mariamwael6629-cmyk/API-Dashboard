from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.team import TeamInviteRequest, TeamMemberCreate, TeamMemberOut, TeamMemberUpdate
from app.services import team_service

router = APIRouter(prefix="/team", tags=["team"])


@router.get("", response_model=list[TeamMemberOut])
async def list_members(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await team_service.list_members(db, current_user.id)


@router.post("", response_model=TeamMemberOut, status_code=201)
async def create_member(
    payload: TeamMemberCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return await team_service.create_member(db, current_user.id, payload)


@router.put("/{member_id}", response_model=TeamMemberOut)
async def update_member(
    member_id: int,
    payload: TeamMemberUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await team_service.update_member(db, current_user.id, member_id, payload)


@router.delete("/{member_id}", status_code=204)
async def delete_member(
    member_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    await team_service.delete_member(db, current_user.id, member_id)
    return None


@router.post("/invite", response_model=TeamMemberOut, status_code=201)
async def invite_member(
    payload: TeamInviteRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return await team_service.invite_member(db, current_user.id, payload)
