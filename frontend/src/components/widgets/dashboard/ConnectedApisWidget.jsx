import { Plug } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import StatusDot from "../../ui/StatusDot";
import { PROVIDERS } from "../../../lib/mockData";

export default function ConnectedApisWidget() {
  return (
    <GlassCard className="col-span-4 p-5 sm:col-span-2 lg:col-span-2">
      <div className="flex items-center gap-2">
        <Plug className="h-4 w-4 text-violet-300" />
        <h3 className="font-display text-sm font-semibold text-slate-100">Connected APIs</h3>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">
        {PROVIDERS.filter((p) => p.status === "connected").length} of {PROVIDERS.length} active
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PROVIDERS.map((p) => (
          <div
            key={p.id}
            className="glass flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs"
            title={`${p.name}: ${p.status}`}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
              style={{ backgroundColor: `${p.color}22`, color: p.color }}
            >
              {p.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="flex-1 truncate text-slate-300">{p.name}</span>
            <StatusDot status={p.status} className="shrink-0" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
