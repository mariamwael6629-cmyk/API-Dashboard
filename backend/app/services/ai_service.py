from typing import Any

import httpx

from app.core.config import settings

SYSTEM_PRIMER = (
    "You are the Nexora AI Assistant, helping developers aggregate, monitor and test third-party APIs."
)


def _rule_based_reply(message: str, context: dict[str, Any] | None) -> tuple[str, list[str]]:
    lowered = message.lower()

    if any(word in lowered for word in ["error", "fail", "500", "exception", "traceback"]):
        return (
            "It looks like you're debugging an error. Check the connection's status on the Connections page, "
            "review recent entries in /connections/{id}/logs for the failing status code, and confirm the "
            "credentials haven't expired. Rate-limited providers (429) usually mean rate_limit_used has hit "
            "rate_limit_limit — consider backing off or upgrading your plan.",
            [
                "Show me recent error logs for this connection",
                "How do I fix a 401 Unauthorized error?",
                "What does a 429 rate limit error mean?",
            ],
        )

    if any(word in lowered for word in ["endpoint", "aggregat", "merge", "combine"]):
        return (
            "To build a unified endpoint: create a UnifiedEndpoint with the source connection IDs you want to "
            "fan out to, then define a transform_config with a 'rename' map to normalize field names across "
            "providers. Calling POST /aggregation/{id}/execute will hit every source concurrently and merge the "
            "responses into one payload.",
            [
                "Generate a sample transform_config for merging Stripe and GitHub",
                "How does the aggregation engine handle partial failures?",
            ],
        )

    if any(word in lowered for word in ["sample", "example", "curl", "snippet", "code"]):
        return (
            "Here's a sample request pattern: POST /testing/run with {method, url, headers, body}. The response "
            "includes ready-to-use curl, JavaScript fetch, and Python requests snippets so you can drop the call "
            "straight into your app.",
            ["Generate a curl example for the GitHub API", "Show me a Python requests example for Stripe charges"],
        )

    if any(word in lowered for word in ["webhook"]):
        return (
            "Use POST /webhooks/test with a target URL and JSON payload to fire a real HTTP request and inspect "
            "the response — handy for verifying your webhook receiver before going live.",
            ["Test a webhook against httpbin.org", "How do I log webhook delivery history?"],
        )

    if any(word in lowered for word in ["plan", "billing", "upgrade", "pricing", "subscription"]):
        return (
            "Nexora has three plans: Starter (free, 10k requests/mo), Pro ($49/mo, 2M requests/mo + workflow "
            "builder), and Scale ($199/mo, dedicated throughput + SSO). Check GET /billing/plans for full details "
            "or POST /billing/checkout to upgrade.",
            ["Compare the Pro and Scale plans", "How do I see my current usage?"],
        )

    return (
        "I can help you connect APIs, build unified endpoints, debug errors, generate request snippets, test "
        "webhooks, or explain billing. Try asking something like \"why is my Stripe connection degraded?\" or "
        "\"generate a curl command for the OpenAI chat endpoint.\"",
        [
            "How do I connect a new API?",
            "Explain the difference between API key and OAuth connections",
            "What does the monitoring dashboard track?",
        ],
    )


async def chat(message: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
    api_key = settings.OPENAI_API_KEY

    if not api_key:
        reply, suggestions = _rule_based_reply(message, context)
        return {"reply": reply, "suggestions": suggestions, "mock": True}

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": SYSTEM_PRIMER},
                        {"role": "user", "content": message},
                    ],
                    "max_tokens": 300,
                },
            )
        data = resp.json()
        reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        if not reply:
            reply = "The AI provider returned an empty response."
        return {"reply": reply, "suggestions": [], "mock": False}
    except httpx.HTTPError as exc:
        reply, suggestions = _rule_based_reply(message, context)
        return {"reply": reply, "suggestions": suggestions, "mock": True, "fallback_error": str(exc)}
