import clsx from "clsx";
import GlassCard from "../../ui/GlassCard";
import Badge from "../../ui/Badge";
import StatusDot from "../../ui/StatusDot";

export default function WorkflowList({ workflows, activeId, onOpen }) {
  return (
    <GlassCard className="p-4 sm:p-5">
      <h3 className="font-display text-sm font-semibold text-slate-100">Saved Workflows</h3>
      <div className="mt-3 space-y-2">
        {workflows.map((wf) => (
          <button
            key={wf.id}
            type="button"
            onClick={() => onOpen(wf)}
            aria-current={activeId === wf.id}
            className={clsx(
              "focus-ring flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left transition-colors cursor-pointer",
              activeId === wf.id
                ? "border-cyan-400/40 bg-cyan-400/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{wf.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {wf.nodes} nodes &middot; last run {wf.lastRun}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <StatusDot status={wf.status === "active" ? "active" : "paused"} pulse={wf.status === "active"} />
              <Badge tone={wf.status === "active" ? "lime" : "amber"}>{wf.status}</Badge>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
