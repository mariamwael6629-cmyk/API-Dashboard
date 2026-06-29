from typing import Any

from pydantic import BaseModel, Field


class TestRunRequest(BaseModel):
    method: str = "GET"
    url: str
    headers: dict[str, str] = Field(default_factory=dict)
    body: dict[str, Any] | None = None
    connection_id: int | None = None


class CodeSnippets(BaseModel):
    curl: str
    javascript: str
    python: str


class TestRunResponse(BaseModel):
    status_code: int
    latency_ms: int
    headers: dict[str, str] = Field(default_factory=dict)
    body: Any
    simulated: bool
    snippets: CodeSnippets
