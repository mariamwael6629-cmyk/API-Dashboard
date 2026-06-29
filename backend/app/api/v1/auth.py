from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    OAuthCallbackResponse,
    OAuthLoginResponse,
    TokenResponse,
    UserLogin,
    UserOut,
    UserRegister,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    user = await auth_service.register_user(db, payload)
    token = auth_service.issue_token(user)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await auth_service.authenticate_user(db, payload)
    token = auth_service.issue_token(user)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)


@router.get("/oauth/{provider}/login", response_model=OAuthLoginResponse)
async def oauth_login(provider: str):
    url, is_mock = auth_service.build_oauth_authorize_url(provider.lower())
    return OAuthLoginResponse(provider=provider, authorize_url=url, mock=is_mock)


@router.get("/oauth/{provider}/callback", response_model=OAuthCallbackResponse)
async def oauth_callback(provider: str, code: str | None = None):
    is_mock = code is None or code.startswith("mock")
    detail = (
        f"Mock OAuth callback for '{provider}' — no real authorization code exchanged."
        if is_mock
        else f"Received authorization code for '{provider}'. In production this would be exchanged for tokens."
    )
    return OAuthCallbackResponse(provider=provider, status="ok", detail=detail, mock=is_mock)
