// Local fallback reply generator used when the real /assistant/chat endpoint
// isn't reachable yet — keyword-matches the user's message to produce a
// believable, contextually relevant response instead of a generic stub.

function explainError(message) {
  const codeMatch = message.match(/\b(\d{3})\b/);
  const code = codeMatch ? codeMatch[1] : "429";
  const explanations = {
    "429": "A 429 means you've hit a rate limit. The provider is telling you to slow down — check the `Retry-After` header and back off requests, or batch/cache calls to stay under the quota. In Nexora you can see live rate-limit usage per provider on the Marketplace and Analytics pages.",
    "401": "A 401 means the request wasn't authenticated correctly — usually an expired or missing token/API key. Double-check the Auth tab in the Testing Lab and make sure your key hasn't been revoked in Settings.",
    "403": "A 403 means the request was authenticated but not authorized for that resource — check the scopes/permissions granted to your API key or OAuth app.",
    "404": "A 404 means the endpoint or resource path doesn't exist. Verify the path and any path parameters (IDs) in your request URL.",
    "500": "A 500 is a server-side error on the provider's end. Retry with exponential backoff; if it persists, check the provider's status page — it's outside your control.",
  };
  return (
    explanations[code] ??
    `That status code generally indicates a client or server-side issue with the request. Check the response body for a more specific error message, and verify your headers, auth, and payload shape in the Testing Lab.`
  );
}

function suggestMapping(message) {
  const lower = message.toLowerCase();
  const services = ["stripe", "slack", "github", "openai", "discord", "google"].filter((s) =>
    lower.includes(s)
  );
  if (services.length >= 2) {
    const [a, b] = services;
    return `Here's a simple mapping idea for ${a} → ${b}:\n\n1. Trigger: new event from ${a} (e.g. webhook)\n2. Transform: extract the relevant fields into a normalized payload\n3. API Call: send to ${b}'s API (e.g. post a message or create a record)\n4. Output: log the result and handle retries on failure\n\nYou can wire this up visually in the Workflow Builder — drag a Trigger, an API Call node for each service, a Transform in between, and an Output node.`;
  }
  return "To map one API's data to another, start by identifying the shared entity (user, event, transaction), then build a Workflow with: Trigger -> API Call (source) -> Transform (reshape fields) -> API Call or Output (destination). Open the Workflow Builder to assemble it visually with drag-and-drop nodes.";
}

function genericReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("quota")) {
    return "You can monitor rate limit usage per provider on the Marketplace page — each card shows a usage bar against its limit. If you're consistently near the cap, consider upgrading your plan on the Billing page for higher throughput.";
  }
  if (lower.includes("workflow")) {
    return "Workflows let you chain Trigger, API Call, Transform, Condition, and Output nodes visually. Head to the Workflow Builder to drag nodes onto the canvas, wire them together, and hit \"Run workflow\" to simulate execution end-to-end.";
  }
  if (lower.includes("test") || lower.includes("request")) {
    return "The API Testing Lab lets you build a request (method, URL, headers, body, auth), send it, and inspect the response with a syntax-highlighted JSON viewer. It also generates ready-to-paste cURL, JavaScript, and Python snippets.";
  }
  return "I can help with endpoint mappings, debugging error codes, generating sample requests, or navigating Nexora's workflow and testing tools. Try asking about a specific provider, error code, or integration you're working on.";
}

export function generateAssistantReply(message) {
  const lower = message.toLowerCase();
  if (/\b(error|429|500|401|403|404|fail|failed|failing)\b/.test(lower)) {
    return explainError(message);
  }
  if (/\b(endpoint|mapping|map|workflow|integrat)/.test(lower)) {
    return suggestMapping(message);
  }
  return genericReply(message);
}

export const SUGGESTED_PROMPTS = [
  "Suggest an endpoint mapping for Stripe + Slack",
  "Explain this 429 error",
  "Generate a sample request for GitHub issues",
  "How do I monitor rate limits across providers?",
];
