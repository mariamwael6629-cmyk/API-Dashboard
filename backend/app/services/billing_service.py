import random
import uuid
from datetime import datetime, timedelta, timezone

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.connection import Connection
from app.models.subscription import Subscription

PLANS = [
    {
        "id": "starter",
        "name": "Starter",
        "price": 0,
        "tagline": "For solo builders exploring the platform",
        "highlight": False,
        "features": ["3 connected APIs", "10k requests / mo", "Community support", "Basic analytics"],
    },
    {
        "id": "pro",
        "name": "Pro",
        "price": 49,
        "tagline": "For fast-moving product teams",
        "highlight": True,
        "features": ["Unlimited APIs", "2M requests / mo", "Workflow builder", "Priority support", "Team roles"],
    },
    {
        "id": "scale",
        "name": "Scale",
        "price": 199,
        "tagline": "For high-volume platforms",
        "highlight": False,
        "features": [
            "Dedicated throughput",
            "SLA 99.99%",
            "SSO + audit logs",
            "Custom integrations",
            "White-glove onboarding",
        ],
    },
]

PLAN_LIMITS = {
    "starter": {"requests": 10_000, "connections": 3},
    "pro": {"requests": 2_000_000, "connections": 999},
    "scale": {"requests": 50_000_000, "connections": 9999},
}


def get_plans() -> list[dict]:
    return PLANS


async def get_or_create_subscription(db: AsyncSession, owner_id: int) -> Subscription:
    sub = await db.scalar(select(Subscription).where(Subscription.owner_id == owner_id))
    if sub is None:
        sub = Subscription(
            owner_id=owner_id,
            plan="starter",
            status="active",
            current_period_end=datetime.now(timezone.utc) + timedelta(days=30),
        )
        db.add(sub)
        await db.commit()
        await db.refresh(sub)
    return sub


async def create_checkout_session(db: AsyncSession, owner_id: int, plan: str) -> dict:
    api_key = settings.STRIPE_API_KEY

    if not api_key:
        session_id = f"cs_mock_{uuid.uuid4().hex[:16]}"
        return {
            "checkout_url": f"https://mock-checkout.nexora.dev/pay/{session_id}?plan={plan}",
            "session_id": session_id,
            "mock": True,
        }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                "https://api.stripe.com/v1/checkout/sessions",
                auth=(api_key, ""),
                data={
                    "mode": "subscription",
                    "line_items[0][price_data][currency]": "usd",
                    "line_items[0][price_data][product_data][name]": f"Nexora {plan.capitalize()} Plan",
                    "line_items[0][price_data][unit_amount]": next(
                        (p["price"] * 100 for p in PLANS if p["id"] == plan), 0
                    ),
                    "line_items[0][quantity]": 1,
                    "success_url": "https://app.nexora.dev/billing/success",
                    "cancel_url": "https://app.nexora.dev/billing/cancel",
                },
            )
        data = resp.json()
        return {"checkout_url": data.get("url", ""), "session_id": data.get("id", ""), "mock": False}
    except httpx.HTTPError as exc:
        return {"checkout_url": "", "session_id": "", "mock": False, "error": str(exc)}


async def update_subscription_plan(db: AsyncSession, owner_id: int, plan: str) -> Subscription:
    sub = await get_or_create_subscription(db, owner_id)
    sub.plan = plan
    sub.status = "active"
    sub.current_period_end = datetime.now(timezone.utc) + timedelta(days=30)
    await db.commit()
    await db.refresh(sub)
    return sub


async def get_usage(db: AsyncSession, owner_id: int) -> dict:
    sub = await get_or_create_subscription(db, owner_id)
    limits = PLAN_LIMITS.get(sub.plan, PLAN_LIMITS["starter"])

    result = await db.scalars(select(Connection).where(Connection.owner_id == owner_id))
    connections_used = len(list(result.all()))

    requests_used = random.randint(int(limits["requests"] * 0.1), int(limits["requests"] * 0.6))

    return {
        "plan": sub.plan,
        "requests_used": requests_used,
        "requests_limit": limits["requests"],
        "connections_used": connections_used,
        "connections_limit": limits["connections"],
        "period_end": sub.current_period_end,
    }
