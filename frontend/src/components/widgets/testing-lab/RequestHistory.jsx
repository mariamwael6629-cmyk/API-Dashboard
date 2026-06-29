import clsx from "clsx";
import { History } from "lucide-react";
import Badge from "../../ui/Badge";

function statusTone(status) {
  if (status >= 200 && status < 300) return "lime";
  if (status >= 400 && status < 500) return "amber";
  if (status >= 500) return "rose";
  return "slate";
}

export default function RequestHistory({ history, onSelect, activeId }) {
  if (history.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <History className="h-3.5 w-3.5" /> Sent requests will show up here.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {history.map((h) => (
        <button
          key={h.id}
          type="button"
          onClick={() => onSelect(h)}
          className={clsx(
            "focus-ring flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors cursor-pointer",
            activeId === h.id
              ? "border-cyan-400/40 bg-cyan-400/5"
              : "border-white/5 bg-white/[0.02] hover:border-white/15"
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="font-mono font-semibold text-slate-300">{h.method}</span>
            <span className="truncate text-slate-400">{h.url}</span>
          </span>
          <Badge tone={statusTone(h.status)} className="shrink-0">
            {h.status}
          </Badge>
        </button>
      ))}
    </div>
  );
}
