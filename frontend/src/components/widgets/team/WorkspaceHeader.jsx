import { Users, Wifi } from "lucide-react";
import GlassCard from "../../ui/GlassCard";

export default function WorkspaceHeader({ memberCount, onlineCount }) {
  return (
    <GlassCard strong glow="violet" className="flex flex-wrap items-center justify-between gap-5 p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400/20 to-cyan-400/20 text-violet-300">
          <Users className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-100">Nexora Workspace</h2>
          <p className="text-sm text-slate-400">Shared workspace &middot; real-time collaboration enabled</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="font-display text-2xl font-semibold text-slate-50">{memberCount}</p>
          <p className="text-xs text-slate-400">Members</p>
        </div>
        <div className="text-center">
          <p className="flex items-center justify-center gap-1.5 font-display text-2xl font-semibold text-lime-300">
            <Wifi className="h-4 w-4" /> {onlineCount}
          </p>
          <p className="text-xs text-slate-400">Online now</p>
        </div>
      </div>
    </GlassCard>
  );
}
