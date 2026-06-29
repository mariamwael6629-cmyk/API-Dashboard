import { useState } from "react";
import { User, KeyRound, Bell, Terminal, AlertTriangle } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import { useAuthStore } from "../store/authStore";
import SettingsNav from "../components/widgets/settings/SettingsNav";
import ProfileSection from "../components/widgets/settings/ProfileSection";
import ApiKeysSection from "../components/widgets/settings/ApiKeysSection";
import PreferencesSection from "../components/widgets/settings/PreferencesSection";
import EnvVariablesSection from "../components/widgets/settings/EnvVariablesSection";
import DangerZoneSection from "../components/widgets/settings/DangerZoneSection";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "preferences", label: "Notifications", icon: Bell },
  { id: "env", label: "Environment", icon: Terminal },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function Settings() {
  const [active, setActive] = useState("profile");
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      <Topbar title="Settings" subtitle="Manage your profile, API keys, environment, and workspace preferences." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        <SettingsNav sections={SECTIONS} active={active} onSelect={setActive} />

        <div className="space-y-6">
          {active === "profile" && <ProfileSection user={user} />}
          {active === "api-keys" && <ApiKeysSection />}
          {active === "preferences" && <PreferencesSection />}
          {active === "env" && <EnvVariablesSection />}
          {active === "danger" && <DangerZoneSection />}
        </div>
      </div>
    </div>
  );
}
