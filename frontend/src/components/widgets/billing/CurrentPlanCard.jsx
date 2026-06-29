import { Sparkles } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";

export default function CurrentPlanCard({ plan, onManage }) {
  return (
    <GlassCard strong glow="cyan" className="flex flex-wrap items-center justify-between gap-5 p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 text-cyan-300">
          <Sparkles className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-slate-100">{plan.name} Plan</h2>
            <Badge tone="cyan">Current</Badge>
          </div>
          <p className="text-sm text-slate-400">{plan.tagline}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-display text-2xl font-semibold text-slate-50">
            ${plan.price}
            <span className="text-sm font-normal text-slate-400">/mo</span>
          </p>
        </div>
        <Button onClick={onManage}>Manage subscription</Button>
      </div>
    </GlassCard>
  );
}
