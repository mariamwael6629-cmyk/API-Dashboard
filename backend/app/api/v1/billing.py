from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.billing import (
    CheckoutRequest,
    CheckoutResponse,
    PlanFeature,
    PlansResponse,
    SubscriptionOut,
    UsageResponse,
)
from app.services import billing_service

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("/plans", response_model=PlansResponse)
async def get_plans():
    return PlansResponse(plans=[PlanFeature(**p) for p in billing_service.get_plans()])


@router.get("/subscription", response_model=SubscriptionOut)
async def get_subscription(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await billing_service.get_or_create_subscription(db, current_user.id)


@router.post("/checkout", response_model=CheckoutResponse)
async def checkout(
    payload: CheckoutRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    session = await billing_service.create_checkout_session(db, current_user.id, payload.plan)
    await billing_service.update_subscription_plan(db, current_user.id, payload.plan)
    return CheckoutResponse(**session)


@router.get("/usage", response_model=UsageResponse)
async def usage(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    data = await billing_service.get_usage(db, current_user.id)
    return UsageResponse(**data)
