"""Maps a Connection.provider string to its integration adapter module."""

from types import ModuleType

from app.integrations import custom, discord, github, google, openai, slack, stripe

_REGISTRY: dict[str, ModuleType] = {
    "openai": openai,
    "stripe": stripe,
    "github": github,
    "slack": slack,
    "discord": discord,
    "google": google,
    "custom": custom,
}


def get_adapter(provider: str) -> ModuleType:
    adapter = _REGISTRY.get(provider)
    if adapter is None:
        return custom
    return adapter
