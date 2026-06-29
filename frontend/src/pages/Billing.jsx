import { useState } from "react";
import { toast } from "sonner";
import Topbar from "../components/layout/Topbar";
import api from "../lib/api";
import { PRICING_PLANS } from "../lib/mockData";
import CurrentPlanCard from "../components/widgets/billing/CurrentPlanCard";
import UsageQuotas from "../components/widgets/billing/UsageQuotas";
import PlanComparisonGrid from "../components/widgets/billing/PlanComparisonGrid";
import InvoiceHistory from "../components/widgets/billing/InvoiceHistory";

const QUOTAS = [
  { label: "API requests", used: 1_640_000, limit: 2_000_000, unit: "" },
  { label: "Connected APIs", used: 6, limit: 8, unit: "" },
  { label: "Workflow runs", used: 312, limit: 500, unit: "" },
];

const INVOICES = [
  { id: "inv_1042", date: "Jun 01, 2026", amount: 49, status: "Paid" },
  { id: "inv_1031", date: "May 01, 2026", amount: 49, status: "Paid" },
  { id: "inv_1020", date: "Apr 01, 2026", amount: 49, status: "Paid" },
  { id: "inv_1009", date: "Mar 01, 2026", amount: 0, status: "Paid" },
];

export default function Billing() {
  const [currentPlanId, setCurrentPlanId] = useState("pro");
  const currentPlan = PRICING_PLANS.find((p) => p.id === currentPlanId) ?? PRICING_PLANS[0];

  const handleManage = async () => {
    try {
      await api.post("/billing/checkout", { planId: currentPlanId });
      toast.success("Redirecting to billing portal...");
    } catch {
      toast.info("Stripe checkout would open here (UI-only demo — no live payment integration yet).");
    }
  };

  const handleSelectPlan = async (plan) => {
    try {
      await api.post("/billing/checkout", { planId: plan.id });
      toast.success(`Upgrading to ${plan.name}...`);
      setCurrentPlanId(plan.id);
    } catch {
      toast.info(`Stripe checkout would open here to upgrade to ${plan.name}.`);
      setCurrentPlanId(plan.id);
    }
  };

  return (
    <div className="space-y-6">
      <Topbar title="Billing & Subscription" subtitle="Manage your plan, usage, and payment history." />

      <CurrentPlanCard plan={currentPlan} onManage={handleManage} />

      <UsageQuotas quotas={QUOTAS} />

      <div>
        <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Compare plans</h2>
        <PlanComparisonGrid plans={PRICING_PLANS} currentPlanId={currentPlanId} onSelect={handleSelectPlan} />
      </div>

      <InvoiceHistory invoices={INVOICES} />
    </div>
  );
}
