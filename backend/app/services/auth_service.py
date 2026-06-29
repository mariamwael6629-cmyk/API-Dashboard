from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import UserLogin, UserRegister

OAUTH_PROVIDERS = {
    "github": {"client_id": settings.GITHUB_CLIENT_ID, "authorize_url": "https://github.com/login/oauth/authorize"},
    "slack": {"client_id": settings.SLACK_CLIENT_ID, "authorize_url": "https://slack.com/oauth/v2/authorize"},
    "discord": {"client_id": settings.DISCORD_CLIENT_ID, "authorize_url": "https://discord.com/api/oauth2/authorize"},
    "google": {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "authorize_url": "https://accounts.google.com/o/oauth2/v2/auth",
    },
}


async def register_user(db: AsyncSession, payload: UserRegister) -> User:
    existing = await db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        name=payload.name,
        role="Owner",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, payload: UserLogin) -> User:
    user = await db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return user


def issue_token(user: User) -> str:
    return create_access_token(subject=str(user.id))


async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    return await db.get(User, user_id)


def build_oauth_authorize_url(provider: str) -> tuple[str, bool]:
    """Returns (authorize_url, is_mock)."""
    cfg = OAUTH_PROVIDERS.get(provider)
    if cfg is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Unknown OAuth provider '{provider}'")

    if not cfg["client_id"]:
        return (
            f"https://mock-oauth.nexora.dev/authorize?provider={provider}&mock=true",
            True,
        )

    redirect_uri = f"{settings.API_V1_PREFIX}/auth/oauth/{provider}/callback"
    url = f"{cfg['authorize_url']}?client_id={cfg['client_id']}&redirect_uri={redirect_uri}&response_type=code"
    return url, False
