import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2 } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import { generateRequestLogs } from "../../../lib/mockData";

const COLORS = { success: "#b6ff3c", client_error: "#ffb347", server_error: "#ff4fd8" };

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs" style={{ color: p.payload.fill }}>
      {p.name}: {p.value}
    </div>
  );
}

export default function SuccessRateDonut() {
  const breakdown = useMemo(() => {
    const logs = generateRequestLogs(120);
    const success = logs.filter((l) => l.status < 400).length;
    const clientError = logs.filter((l) => l.status >= 400 && l.status < 500).length;
    const serverError = logs.filter((l) => l.status >= 500).length;
    return [
      { name: "Success", value: success, fill: COLORS.success },
      { name: "Client Error (4xx)", value: clientError, fill: COLORS.client_error },
      { name: "Server Error (5xx)", value: serverError, fill: COLORS.server_error },
    ];
  }, []);

  const total = breakdown.reduce((acc, b) => acc + b.value, 0);
  const successPct = total ? Math.round((breakdown[0].value / total) * 100) : 0;

  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-lime-300" />
        <h3 className="font-display text-sm font-semibold text-slate-100">Success / Failure</h3>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">Request outcome breakdown</p>

      <div className="relative mt-2 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdown}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {breakdown.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold text-slate-50">{successPct}%</span>
          <span className="text-xs text-slate-500">success rate</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
        {breakdown.map((b) => (
          <div key={b.name} className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: b.fill }} />
            {b.name} ({b.value})
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
