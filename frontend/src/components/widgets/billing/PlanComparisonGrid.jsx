import { Check } from "lucide-react";
import clsx from "clsx";
import GlassCard from "../../ui/GlassCard";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";

export default function PlanComparisonGrid({ plans, currentPlanId, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = plan.id === currentPlanId;
        return (
          <GlassCard
            key={plan.id}
            strong={plan.highlight}
            glow={plan.highlight ? "violet" : undefined}
            className={clsx("flex flex-col p-6", isCurrent && "ring-1 ring-cyan-400/40")}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-slate-100">{plan.name}</h3>
              {isCurrent && <Badge tone="cyan">Current</Badge>}
              {!isCurrent && plan.highlight && <Badge tone="violet">Popular</Badge>}
            </div>
            <p className="mt-1 text-xs text-slate-400">{plan.tagline}</p>
            <p className="mt-4 font-display text-3xl font-semibold text-slate-50">
              ${plan.price}
              <span className="text-sm font-normal text-slate-400">/mo</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={isCurrent ? "secondary" : plan.highlight ? "primary" : "secondary"}
              className="mt-6 w-full"
              disabled={isCurrent}
              onClick={() => onSelect(plan)}
            >
              {isCurrent ? "Current plan" : "Upgrade"}
            </Button>
          </GlassCard>
        );
      })}
    </div>
  );
}
