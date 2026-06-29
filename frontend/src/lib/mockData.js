// Shared mock/demo data used across pages until the live backend
// connection (see src/lib/api.js and src/hooks/useLiveFeed.js) replaces it.

export const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    category: "AI / ML",
    color: "#74e0c4",
    auth: "api_key",
    status: "connected",
    requests24h: 18234,
    errorRate: 0.4,
    avgLatency: 312,
    rateLimit: { used: 6200, limit: 10000 },
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    color: "#a78bfa",
    auth: "api_key",
    status: "connected",
    requests24h: 5421,
    errorRate: 0.1,
    avgLatency: 184,
    rateLimit: { used: 1800, limit: 5000 },
  },
  {
    id: "github",
    name: "GitHub",
    category: "Dev Tools",
    color: "#e8eaf2",
    auth: "oauth",
    status: "connected",
    requests24h: 9120,
    errorRate: 0.8,
    avgLatency: 221,
    rateLimit: { used: 4100, limit: 5000 },
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    color: "#ff4fd8",
    auth: "oauth",
    status: "connected",
    requests24h: 3012,
    errorRate: 0.2,
    avgLatency: 145,
    rateLimit: { used: 900, limit: 10000 },
  },
  {
    id: "discord",
    name: "Discord",
    category: "Communication",
    color: "#4cf3ff",
    auth: "oauth",
    status: "degraded",
    requests24h: 1284,
    errorRate: 4.6,
    avgLatency: 540,
    rateLimit: { used: 300, limit: 5000 },
  },
  {
    id: "google",
    name: "Google APIs",
    category: "Cloud",
    color: "#ffb347",
    auth: "oauth",
    status: "connected",
    requests24h: 7741,
    errorRate: 0.3,
    avgLatency: 198,
    rateLimit: { used: 2600, limit: 10000 },
  },
  {
    id: "custom-crm",
    name: "Internal CRM",
    category: "Custom",
    color: "#b6ff3c",
    auth: "header",
    status: "disconnected",
    requests24h: 0,
    errorRate: 0,
    avgLatency: 0,
    rateLimit: { used: 0, limit: 0 },
  },
];

export const TEAM_MEMBERS = [
  { id: 1, name: "Mariam Wael", email: "mariam@nexora.dev", role: "Owner", status: "online", avatarColor: "#4cf3ff" },
  { id: 2, name: "Omar Hassan", email: "omar@nexora.dev", role: "Admin", status: "online", avatarColor: "#a78bfa" },
  { id: 3, name: "Lina Farouk", email: "lina@nexora.dev", role: "Developer", status: "idle", avatarColor: "#ff4fd8" },
  { id: 4, name: "Yusuf Adel", email: "yusuf@nexora.dev", role: "Developer", status: "offline", avatarColor: "#ffb347" },
  { id: 5, name: "Sara Khaled", email: "sara@nexora.dev", role: "Viewer", status: "online", avatarColor: "#b6ff3c" },
];

export const WORKFLOWS = [
  { id: "wf_1", name: "Support Ticket Enricher", nodes: 5, status: "active", lastRun: "2m ago" },
  { id: "wf_2", name: "Payment Webhook Router", nodes: 4, status: "active", lastRun: "11m ago" },
  { id: "wf_3", name: "AI Lead Qualifier", nodes: 7, status: "paused", lastRun: "3h ago" },
];

export function generateTrafficSeries(points = 24) {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const t = new Date(now - (points - i) * 60 * 60 * 1000);
    const base = 400 + Math.sin(i / 3) * 150;
    return {
      time: t.toLocaleTimeString([], { hour: "2-digit" }),
      requests: Math.round(base + Math.random() * 120),
      errors: Math.round(Math.random() * 12),
      latency: Math.round(150 + Math.random() * 200),
    };
  });
}

export function generateHeatmap() {
  const hours = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    cells: hours.map((h) => ({ hour: h, value: Math.round(Math.random() * 100) })),
  }));
}

export function generateRequestLogs(n = 20) {
  const methods = ["GET", "POST", "PUT", "DELETE"];
  const statuses = [200, 200, 200, 201, 204, 400, 401, 404, 500];
  return Array.from({ length: n }, (_, i) => {
    const provider = PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `req_${Date.now()}_${i}`,
      provider: provider.name,
      method: methods[Math.floor(Math.random() * methods.length)],
      path: `/v1/${provider.id}/${["users", "messages", "charges", "repos", "events"][i % 5]}`,
      status,
      latency: Math.round(80 + Math.random() * 500),
      time: new Date(Date.now() - i * 45000).toLocaleTimeString(),
    };
  });
}

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    tagline: "For solo builders exploring the platform",
    features: ["3 connected APIs", "10k requests / mo", "Community support", "Basic analytics"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    tagline: "For fast-moving product teams",
    highlight: true,
    features: ["Unlimited APIs", "2M requests / mo", "Workflow builder", "Priority support", "Team roles"],
  },
  {
    id: "scale",
    name: "Scale",
    price: 199,
    tagline: "For high-volume platforms",
    features: ["Dedicated throughput", "SLA 99.99%", "SSO + audit logs", "Custom integrations", "White-glove onboarding"],
  },
];
