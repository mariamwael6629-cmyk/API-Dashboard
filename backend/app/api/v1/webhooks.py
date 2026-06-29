from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.webhook import WebhookEventOut, WebhookTestRequest, WebhookTestResponse
from app.services import webhook_service

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/test", response_model=WebhookTestResponse)
async def test_webhook(payload: WebhookTestRequest, current_user: User = Depends(get_current_user)):
    result = await webhook_service.fire_webhook(payload)
    return WebhookTestResponse(**result)


@router.get("/events", response_model=list[WebhookEventOut])
async def list_events(current_user: User = Depends(get_current_user)):
    return [WebhookEventOut(**event) for event in webhook_service.list_events()]
