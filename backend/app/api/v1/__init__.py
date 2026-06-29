from fastapi import APIRouter

from app.api.v1 import (
    aggregation,
    ai_assistant,
    auth,
    billing,
    connections,
    env_vars,
    monitoring,
    team,
    testing,
    webhooks,
    workflows,
    ws,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(connections.router)
api_router.include_router(aggregation.router)
api_router.include_router(monitoring.router)
api_router.include_router(workflows.router)
api_router.include_router(testing.router)
api_router.include_router(team.router)
api_router.include_router(billing.router)
api_router.include_router(ai_assistant.router)
api_router.include_router(webhooks.router)
api_router.include_router(env_vars.router)

__all__ = ["api_router", "ws"]
