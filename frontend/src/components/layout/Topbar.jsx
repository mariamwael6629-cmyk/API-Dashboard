import { Search, Bell, Wifi, WifiOff } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import StatusDot from "../ui/StatusDot";

export default function Topbar({ title, subtitle, connected = true }) {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/8 bg-void-900/60 px-5 py-3 backdrop-blur-sm">
      <div>
        <h1 className="font-display text-lg font-semibold text-slate-100 sm:text-xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="focus-ring hidden items-center gap-2 rounded-lg border border-white/8 bg-void-800 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-brand/30 hover:text-slate-200 sm:flex cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="ml-2 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-void-800 px-2.5 py-1.5 text-xs text-slate-400">
          {connected ? (
            <Wifi className="h-3.5 w-3.5 text-brand-light" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span className="hidden sm:inline">{connected ? "Live" : "Simulated"}</span>
        </div>

        <button className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-void-800 text-slate-400 hover:border-brand/30 hover:text-slate-100 transition-colors cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-void-800 px-2 py-1.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-brand text-xs font-semibold text-white">
            {(user?.name ?? "G")[0].toUpperCase()}
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
