import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import { generateTrafficSeries } from "../../../lib/mockData";
import { useLiveFeed } from "../../../hooks/useLiveFeed";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-slate-300">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function LiveTrafficWidget() {
  const baseline = useMemo(() => generateTrafficSeries(24), []);
  const { data } = useLiveFeed("/ws/monitoring", {
    simulate: () => {
      const next = generateTrafficSeries(24);
      return next;
    },
  });

  const [series, setSeries] = useState(baseline);

  useEffect(() => {
    if (!data) return;
    if (Array.isArray(data)) {
      setSeries(data);
      return;
    }
    // A single live tick from the backend websocket — roll it into the window.
    setSeries((prev) => {
      const point = {
        time: new Date(data.timestamp ?? Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        requests: data.requests ?? 0,
        errors: data.errors ?? 0,
        latency: data.latency_ms ?? 0,
      };
      return [...prev.slice(1), point];
    });
  }, [data]);

  const latest = series[series.length - 1];

  return (
    <GlassCard className="col-span-4 row-span-2 flex flex-col p-5 lg:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-300" />
            <h3 className="font-display text-sm font-semibold text-slate-100">
              Live Traffic
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">Requests routed across all providers</p>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-bold text-slate-50">
            {latest?.requests?.toLocaleString() ?? "—"}
          </div>
          <div className="text-xs text-slate-500">req / hr</div>
        </div>
      </div>

      <div className="mt-4 h-56 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4cf3ff" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#4cf3ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff4fd8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#ff4fd8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={20}
            />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="requests"
              name="Requests"
              stroke="#4cf3ff"
              strokeWidth={2}
              fill="url(#trafficGradient)"
            />
            <Area
              type="monotone"
              dataKey="errors"
              name="Errors"
              stroke="#ff4fd8"
              strokeWidth={2}
              fill="url(#errorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
