import { Search, Bell, Wifi, WifiOff } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import StatusDot from "../ui/StatusDot";

export default function Topbar({ title, subtitle, connected = true }) {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex items-center justify-between gap-4 px-1 py-2">
      <div>
        <h1 className="font-display text-xl font-semibold text-slate-50 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="focus-ring glass hidden items-center gap-2 rounded-xl px-3.5 py-2 text-sm text-slate-400 transition-colors hover:text-slate-100 sm:flex cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-2 rounded border border-white/10 px-1.5 py-0.5 text-[10px]">
            ⌘K
          </kbd>
        </button>

        <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-400">
          {connected ? (
            <Wifi className="h-3.5 w-3.5 text-lime-400" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span className="hidden sm:inline">{connected ? "Live" : "Simulated"}</span>
        </div>

        <button className="focus-ring glass relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-slate-100 cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
        </button>

        <div className="glass flex items-center gap-2 rounded-xl px-2 py-1.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-400 text-xs font-semibold text-void-950">
            {(user?.name ?? "G")[0]}
            <StatusDot status="online" className="absolute -bottom-1 -right-1" />
          </div>
          <span className="hidden text-sm text-slate-200 sm:inline">
            {user?.name ?? "Guest"}
          </span>
        </div>
      </div>
    </header>
  );
}
