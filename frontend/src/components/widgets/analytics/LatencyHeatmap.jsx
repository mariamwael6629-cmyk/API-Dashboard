import { useMemo, useState } from "react";
import { Thermometer } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import { generateHeatmap } from "../../../lib/mockData";

function cellColor(value) {
  // 0-100 -> cyan (cool/low) through violet to magenta (hot/high)
  if (value < 25) return "rgba(76,243,255,0.18)";
  if (value < 50) return "rgba(76,243,255,0.4)";
  if (value < 70) return "rgba(167,139,250,0.55)";
  if (value < 85) return "rgba(255,79,216,0.6)";
  return "rgba(255,79,216,0.9)";
}

export default function LatencyHeatmap() {
  const data = useMemo(() => generateHeatmap(), []);
  const [hovered, setHovered] = useState(null);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-fuchsia-300" />
          <h3 className="font-display text-sm font-semibold text-slate-100">Latency Heatmap</h3>
        </div>
        {hovered && (
          <span className="glass rounded-lg px-2.5 py-1 text-xs text-slate-300">
            {hovered.day} · {hovered.hour} &mdash;{" "}
            <span className="text-cyan-300">{hovered.value}ms</span>
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-slate-500">Relative latency by day and hour</p>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[3rem_repeat(12,1fr)] gap-1">
            <div />
            {data[0].cells.map((c) => (
              <div key={c.hour} className="text-center text-[10px] text-slate-500">
                {c.hour}
              </div>
            ))}
            {data.map((row) => (
              <div key={row.day} className="contents">
                <div className="flex items-center text-[11px] text-slate-500">{row.day}</div>
                {row.cells.map((cell) => (
                  <button
                    key={cell.hour}
                    type="button"
                    onMouseEnter={() => setHovered({ day: row.day, ...cell })}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered({ day: row.day, ...cell })}
                    onBlur={() => setHovered(null)}
                    aria-label={`${row.day} ${cell.hour}: ${cell.value}ms`}
                    className="focus-ring aspect-square w-full rounded-md transition-transform hover:scale-110"
                    style={{ backgroundColor: cellColor(cell.value) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-slate-500">
        <span>Low</span>
        {[15, 40, 60, 80, 95].map((v) => (
          <span
            key={v}
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: cellColor(v) }}
          />
        ))}
        <span>High</span>
      </div>
    </GlassCard>
  );
}
