import { useMemo } from "react";
import { ScrollText } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import Badge from "../../ui/Badge";
import { generateRequestLogs } from "../../../lib/mockData";

const statusTone = (status) => {
  if (status < 300) return "lime";
  if (status < 400) return "cyan";
  if (status < 500) return "amber";
  return "rose";
};

export default function RequestLogsPanel() {
  const logs = useMemo(() => generateRequestLogs(12), []);

  return (
    <GlassCard className="mt-8 p-5">
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-cyan-300" />
        <h3 className="font-display text-sm font-semibold text-slate-100">Request Logs</h3>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">
        Recent calls routed through your connected providers
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500">
              <th className="pb-2 pr-4 font-medium">Provider</th>
              <th className="pb-2 pr-4 font-medium">Method</th>
              <th className="pb-2 pr-4 font-medium">Path</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 pr-4 font-medium">Latency</th>
              <th className="pb-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-white/5 text-slate-300">
                <td className="py-2 pr-4">{log.provider}</td>
                <td className="py-2 pr-4 font-mono text-slate-500">{log.method}</td>
                <td className="py-2 pr-4 truncate text-slate-400">{log.path}</td>
                <td className="py-2 pr-4">
                  <Badge tone={statusTone(log.status)} className="px-1.5 py-0.5 text-[10px]">
                    {log.status}
                  </Badge>
                </td>
                <td className="py-2 pr-4 text-slate-500">{log.latency}ms</td>
                <td className="py-2 text-slate-600">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
