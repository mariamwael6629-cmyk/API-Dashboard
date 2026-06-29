from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ai_assistant import ChatRequest, ChatResponse
from app.services import ai_service

router = APIRouter(prefix="/assistant", tags=["ai_assistant"])


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, current_user: User = Depends(get_current_user)):
    result = await ai_service.chat(payload.message, payload.context)
    return ChatResponse(reply=result["reply"], suggestions=result.get("suggestions", []), mock=result["mock"])
