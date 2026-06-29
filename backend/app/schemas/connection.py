from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ConnectionCreate(BaseModel):
    provider: str
    name: str
    auth_type: str = "api_key"
    credentials: dict[str, Any] = Field(default_factory=dict)


class ConnectionUpdate(BaseModel):
    name: str | None = None
    status: str | None = None
    credentials: dict[str, Any] | None = None
    rate_limit_used: int | None = None
    rate_limit_limit: int | None = None


class ConnectionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    provider: str
    name: str
    auth_type: str
    status: str
    rate_limit_used: int
    rate_limit_limit: int
    masked_credentials: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime


class ConnectionTestResult(BaseModel):
    ok: bool
    status: str
    detail: str
    latency_ms: float
    mock: bool


class RequestLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    connection_id: int | None
    method: str
    path: str
    status_code: int
    latency_ms: int
    created_at: datetime


class PaginatedLogs(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[RequestLogOut]
