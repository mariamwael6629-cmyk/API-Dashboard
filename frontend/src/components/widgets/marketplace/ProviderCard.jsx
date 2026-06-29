import GlassCard from "../../ui/GlassCard";
import Badge from "../../ui/Badge";
import StatusDot from "../../ui/StatusDot";
import ProgressBar from "../../ui/ProgressBar";
import Button from "../../ui/Button";

const categoryTone = {
  "AI / ML": "violet",
  Payments: "magenta",
  "Dev Tools": "slate",
  Communication: "cyan",
  Cloud: "amber",
  Custom: "lime",
};

export default function ProviderCard({ provider, onConfigure }) {
  const isConnected = provider.status !== "disconnected";
  const pct =
    provider.rateLimit.limit > 0
      ? Math.round((provider.rateLimit.used / provider.rateLimit.limit) * 100)
      : 0;

  return (
    <GlassCard className="flex flex-col p-5" glow={provider.status === "degraded" ? "magenta" : undefined}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
            style={{ backgroundColor: `${provider.color}22`, color: provider.color }}
            aria-hidden="true"
          >
            {provider.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-100">
              {provider.name}
            </h3>
            <Badge tone={categoryTone[provider.category] ?? "slate"} className="mt-1">
              {provider.category}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <StatusDot status={provider.status} />
          <span className="capitalize">{provider.status}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="glass rounded-lg py-2">
          <div className="font-display text-sm font-semibold text-slate-100">
            {provider.requests24h.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">req/24h</div>
        </div>
        <div className="glass rounded-lg py-2">
          <div
            className={`font-display text-sm font-semibold ${
              provider.errorRate > 2 ? "text-amber-300" : "text-slate-100"
            }`}
          >
            {provider.errorRate}%
          </div>
          <div className="text-[10px] text-slate-500">errors</div>
        </div>
        <div className="glass rounded-lg py-2">
          <div className="font-display text-sm font-semibold text-slate-100">
            {provider.avgLatency}ms
          </div>
          <div className="text-[10px] text-slate-500">latency</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
          <span>Rate limit</span>
          <span>
            {provider.rateLimit.used.toLocaleString()} / {provider.rateLimit.limit.toLocaleString()}
          </span>
        </div>
        <ProgressBar value={pct} max={100} tone={pct > 80 ? "amber" : "cyan"} />
      </div>

      <Button
        variant={isConnected ? "secondary" : "primary"}
        size="sm"
        className="mt-5 w-full"
        onClick={() => onConfigure(provider)}
      >
        {isConnected ? "Configure" : "Connect"}
      </Button>
    </GlassCard>
  );
}
