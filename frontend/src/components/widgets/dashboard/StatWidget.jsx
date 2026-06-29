import clsx from "clsx";
import GlassCard from "../../ui/GlassCard";

export default function StatWidget({ icon: Icon, label, value, suffix, trend, tone = "cyan" }) {
  const toneColor = {
    cyan: "text-cyan-300",
    amber: "text-amber-300",
    lime: "text-lime-300",
    magenta: "text-fuchsia-300",
  }[tone];

  return (
    <GlassCard className="col-span-2 p-5 sm:col-span-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={clsx("h-4 w-4", toneColor)} />}
        <h3 className="text-xs font-medium text-slate-400">{label}</h3>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold text-slate-50">{value}</span>
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </div>
      {trend && (
        <p
          className={clsx(
            "mt-1 text-xs",
            trend.startsWith("-") ? "text-lime-400" : "text-amber-400"
          )}
        >
          {trend} vs last 24h
        </p>
      )}
    </GlassCard>
  );
}
