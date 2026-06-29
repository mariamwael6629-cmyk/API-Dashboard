import { Layers } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import StatusDot from "../../ui/StatusDot";
import ProgressBar from "../../ui/ProgressBar";
import { PROVIDERS } from "../../../lib/mockData";

export default function ProviderBreakdownTable() {
  const sorted = [...PROVIDERS].sort((a, b) => b.requests24h - a.requests24h);
  const maxRequests = Math.max(...PROVIDERS.map((p) => p.requests24h), 1);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-violet-300" />
        <h3 className="font-display text-sm font-semibold text-slate-100">
          Per-Provider Breakdown
        </h3>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">Traffic share and health by provider</p>

      <div className="mt-4 space-y-3">
        {sorted.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
              style={{ backgroundColor: `${p.color}22`, color: p.color }}
            >
              {p.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1.5 truncate text-slate-200">
                  <StatusDot status={p.status} pulse={false} />
                  {p.name}
                </span>
                <span className="shrink-0 text-slate-500">
                  {p.requests24h.toLocaleString()} req &middot; {p.avgLatency}ms &middot;{" "}
                  <span className={p.errorRate > 2 ? "text-amber-300" : "text-slate-500"}>
                    {p.errorRate}% err
                  </span>
                </span>
              </div>
              <div className="mt-1.5">
                <ProgressBar
                  value={p.requests24h}
                  max={maxRequests}
                  tone={p.errorRate > 2 ? "amber" : "cyan"}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
