from typing import Any

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    context: dict[str, Any] | None = None


class ChatResponse(BaseModel):
    reply: str
    suggestions: list[str] = Field(default_factory=list)
    mock: bool
