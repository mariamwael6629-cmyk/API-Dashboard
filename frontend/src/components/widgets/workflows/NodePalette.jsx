import GlassCard from "../../ui/GlassCard";
import { NODE_TYPE_LIST } from "./nodeTypes";

export default function NodePalette({ onAddNode }) {
  return (
    <GlassCard className="p-4 sm:p-5">
      <h3 className="font-display text-sm font-semibold text-slate-100">Node Palette</h3>
      <p className="mt-1 text-xs text-slate-400">
        Click to drop a node onto the canvas, then drag it into place.
      </p>
      <div className="mt-4 space-y-2.5">
        {NODE_TYPE_LIST.map((nt) => {
          const Icon = nt.icon;
          return (
            <button
              key={nt.type}
              type="button"
              onClick={() => onAddNode(nt.type)}
              aria-label={`Add ${nt.label} node`}
              className="focus-ring glass group flex w-full items-center gap-3 rounded-xl border border-white/10 px-3.5 py-3 text-left transition-all hover:scale-[1.02] hover:border-white/20 cursor-grab active:cursor-grabbing"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${nt.accent}1a`, color: nt.accent }}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-100">{nt.label}</span>
                <span className="block truncate text-[11px] text-slate-400">{nt.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
