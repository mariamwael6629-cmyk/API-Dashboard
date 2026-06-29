from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class UnifiedEndpointCreate(BaseModel):
    name: str
    source_connections: list[int] = Field(default_factory=list)
    transform_config: dict[str, Any] = Field(default_factory=dict)


class UnifiedEndpointUpdate(BaseModel):
    name: str | None = None
    source_connections: list[int] | None = None
    transform_config: dict[str, Any] | None = None


class UnifiedEndpointOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    name: str
    source_connections: list[int]
    transform_config: dict[str, Any]
    created_at: datetime


class ExecuteResult(BaseModel):
    endpoint_id: int
    combined: dict[str, Any]
    sources: list[dict[str, Any]]
