from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class TeamMemberCreate(BaseModel):
    name: str | None = None
    invited_email: EmailStr
    role: str = "Viewer"


class TeamMemberUpdate(BaseModel):
    role: str | None = None
    status: str | None = None
    name: str | None = None


class TeamMemberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    user_id: int | None
    invited_email: str | None
    name: str | None
    role: str
    status: str
    created_at: datetime


class TeamInviteRequest(BaseModel):
    email: EmailStr
    role: str = "Viewer"
    name: str | None = None
