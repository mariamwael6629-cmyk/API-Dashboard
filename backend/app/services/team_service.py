from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.team_member import TeamMember
from app.schemas.team import TeamInviteRequest, TeamMemberCreate, TeamMemberUpdate

VALID_ROLES = {"Owner", "Admin", "Developer", "Viewer"}


async def list_members(db: AsyncSession, owner_id: int) -> list[TeamMember]:
    result = await db.scalars(select(TeamMember).where(TeamMember.owner_id == owner_id).order_by(TeamMember.id))
    return list(result.all())


async def create_member(db: AsyncSession, owner_id: int, payload: TeamMemberCreate) -> TeamMember:
    if payload.role not in VALID_ROLES:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Invalid role '{payload.role}'")

    member = TeamMember(
        owner_id=owner_id,
        invited_email=payload.invited_email,
        name=payload.name,
        role=payload.role,
        status="invited",
    )
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member


async def get_member_or_404(db: AsyncSession, owner_id: int, member_id: int) -> TeamMember:
    member = await db.scalar(select(TeamMember).where(TeamMember.id == member_id, TeamMember.owner_id == owner_id))
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")
    return member


async def update_member(db: AsyncSession, owner_id: int, member_id: int, payload: TeamMemberUpdate) -> TeamMember:
    member = await get_member_or_404(db, owner_id, member_id)

    if payload.role is not None:
        if payload.role not in VALID_ROLES:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Invalid role '{payload.role}'")
        member.role = payload.role
    if payload.status is not None:
        member.status = payload.status
    if payload.name is not None:
        member.name = payload.name

    await db.commit()
    await db.refresh(member)
    return member


async def delete_member(db: AsyncSession, owner_id: int, member_id: int) -> None:
    member = await get_member_or_404(db, owner_id, member_id)
    await db.delete(member)
    await db.commit()


async def invite_member(db: AsyncSession, owner_id: int, payload: TeamInviteRequest) -> TeamMember:
    return await create_member(
        db, owner_id, TeamMemberCreate(invited_email=payload.email, role=payload.role, name=payload.name)
    )
