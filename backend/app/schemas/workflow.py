from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class WorkflowCreate(BaseModel):
    name: str
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    status: str = "paused"


class WorkflowUpdate(BaseModel):
    name: str | None = None
    nodes: list[dict[str, Any]] | None = None
    status: str | None = None


class WorkflowOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    name: str
    nodes: list[dict[str, Any]]
    status: str
    created_at: datetime
