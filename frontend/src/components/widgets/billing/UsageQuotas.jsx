import GlassCard from "../../ui/GlassCard";
import ProgressBar from "../../ui/ProgressBar";

function toneFor(pct) {
  if (pct >= 90) return "amber";
  if (pct >= 70) return "amber";
  return "cyan";
}

export default function UsageQuotas({ quotas }) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Usage this cycle</h2>
      <div className="space-y-5">
        {quotas.map((q) => {
          const pct = Math.min(100, Math.round((q.used / q.limit) * 100));
          return (
            <div key={q.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-slate-300">{q.label}</span>
                <span className="text-slate-400">
                  {q.used.toLocaleString()} / {q.limit.toLocaleString()} {q.unit ?? ""}
                </span>
              </div>
              <ProgressBar value={q.used} max={q.limit} tone={toneFor(pct)} />
              {pct >= 90 && (
                <p className="mt-1 text-xs text-amber-300">Approaching your plan limit — consider upgrading.</p>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
