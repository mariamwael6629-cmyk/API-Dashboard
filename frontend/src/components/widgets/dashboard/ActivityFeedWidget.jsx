import { useMemo } from "react";
import { ListTree } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import Badge from "../../ui/Badge";
import { generateRequestLogs } from "../../../lib/mockData";

const statusTone = (status) => {
  if (status < 300) return "lime";
  if (status < 400) return "cyan";
  if (status < 500) return "amber";
  return "rose";
};

export default function ActivityFeedWidget() {
  const logs = useMemo(() => generateRequestLogs(16), []);

  return (
    <GlassCard className="col-span-4 row-span-2 p-5 lg:col-span-2">
      <div className="flex items-center gap-2">
        <ListTree className="h-4 w-4 text-cyan-300" />
        <h3 className="font-display text-sm font-semibold text-slate-100">Recent Activity</h3>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">Latest requests across connected APIs</p>

      <ul className="mt-4 max-h-72 space-y-1.5 overflow-y-auto pr-1">
        {logs.map((log) => (
          <li
            key={log.id}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs hover:bg-white/5"
          >
            <span className="w-12 shrink-0 font-mono text-[10px] text-slate-500">
              {log.method}
            </span>
            <span className="flex-1 truncate text-slate-300">{log.path}</span>
            <Badge tone={statusTone(log.status)} className="px-1.5 py-0.5 text-[10px]">
              {log.status}
            </Badge>
            <span className="w-14 shrink-0 text-right text-slate-500">{log.latency}ms</span>
            <span className="w-16 shrink-0 text-right text-slate-600">{log.time}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
