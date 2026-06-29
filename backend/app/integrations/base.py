"""Shared interface every provider integration adapter implements.

Every adapter works in two modes:
  - mock mode (default): when the relevant API key/client id is blank in
    settings, adapters fabricate realistic sample data instead of making a
    real HTTP call. This lets the whole app run end-to-end with zero real
    credentials.
  - live mode: when a real key/secret IS configured, adapters make a real
    httpx call against the provider's API.
"""

from abc import ABC, abstractmethod
from typing import Any, Protocol


class IntegrationAdapter(Protocol):
    """Structural protocol every integrations/<provider>.py module satisfies."""

    async def test_connection(self, credentials: dict[str, Any]) -> dict[str, Any]:
        """Verify credentials work. Returns {ok, status, detail, latency_ms}."""
        ...

    async def sample_request(self, credentials: dict[str, Any], path: str = "") -> dict[str, Any]:
        """Perform (or fabricate) a representative API call. Returns a dict payload."""
        ...


class BaseIntegrationAdapter(ABC):
    """Optional ABC base class adapters may extend instead of duck-typing the Protocol."""

    provider: str = "custom"

    @abstractmethod
    async def test_connection(self, credentials: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def sample_request(self, credentials: dict[str, Any], path: str = "") -> dict[str, Any]:
        raise NotImplementedError
