import { ShieldCheck } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import ProgressBar from "../../ui/ProgressBar";

export default function UptimeWidget() {
  const uptime = 99.97;
  return (
    <GlassCard className="col-span-4 p-5 sm:col-span-2 lg:col-span-1" glow="violet">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-lime-300" />
        <h3 className="font-display text-sm font-semibold text-slate-100">Uptime / SLA</h3>
      </div>

      <div className="mt-3 font-display text-4xl font-bold text-slate-50">
        {uptime}<span className="text-lg text-slate-500">%</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">Last 30 days, target 99.9%</p>

      <div className="mt-4">
        <ProgressBar value={uptime} max={100} tone="lime" />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>SLA target</span>
        <span className="text-slate-300">99.90%</span>
      </div>
    </GlassCard>
  );
}
