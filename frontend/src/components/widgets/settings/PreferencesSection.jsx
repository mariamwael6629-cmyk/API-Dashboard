import { useState } from "react";
import GlassCard from "../../ui/GlassCard";
import Switch from "../../ui/Switch";

const INITIAL_TOGGLES = [
  { id: "emailNotifications", label: "Email notifications", description: "Get notified about billing, invites, and security events.", checked: true },
  { id: "realtimeAlerts", label: "Real-time alerts", description: "Push alerts for provider outages and rate-limit warnings.", checked: true },
  { id: "cyberpunkAccent", label: "Cyberpunk accent mode", description: "Boosts neon glow intensity across the dashboard.", checked: false },
  { id: "weeklyDigest", label: "Weekly usage digest", description: "A summary email of usage and spend every Monday.", checked: false },
];

export default function PreferencesSection() {
  const [toggles, setToggles] = useState(INITIAL_TOGGLES);

  const handleToggle = (id, checked) => {
    setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, checked } : t)));
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <h2 className="font-display text-sm font-semibold text-slate-100">Notifications &amp; appearance</h2>
      <div className="mt-5 space-y-4">
        {toggles.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <div>
              <p className="text-sm font-medium text-slate-100">{t.label}</p>
              <p className="text-xs text-slate-400">{t.description}</p>
            </div>
            <Switch checked={t.checked} onChange={(checked) => handleToggle(t.id, checked)} label={t.label} />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
