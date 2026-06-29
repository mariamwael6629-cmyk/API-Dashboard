from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class WebhookTestRequest(BaseModel):
    url: str
    payload: dict[str, Any] = Field(default_factory=dict)
    headers: dict[str, str] = Field(default_factory=dict)
    method: str = "POST"


class WebhookTestResponse(BaseModel):
    ok: bool
    status_code: int | None
    latency_ms: int
    response_body: Any
    error: str | None = None


class WebhookEventOut(BaseModel):
    id: int
    url: str
    method: str
    status_code: int | None
    latency_ms: int
    ok: bool
    created_at: datetime
