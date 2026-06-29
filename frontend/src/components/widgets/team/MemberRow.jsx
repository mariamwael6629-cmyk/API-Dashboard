import { Trash2 } from "lucide-react";
import Badge from "../../ui/Badge";
import StatusDot from "../../ui/StatusDot";

const ROLES = ["Owner", "Admin", "Developer", "Viewer"];
const ROLE_TONE = { Owner: "magenta", Admin: "violet", Developer: "cyan", Viewer: "slate" };

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function MemberRow({ member, onRoleChange, onRemove }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-white/15 sm:flex-nowrap">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-void-950"
        style={{ backgroundColor: member.avatarColor }}
      >
        {initials(member.name)}
        <StatusDot status={member.status} className="absolute -bottom-1 -right-1" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">{member.name}</p>
        <p className="truncate text-xs text-slate-400">{member.email}</p>
      </div>

      <Badge tone={ROLE_TONE[member.role] ?? "slate"} className="shrink-0">
        {member.role}
      </Badge>

      <label className="sr-only" htmlFor={`role-${member.id}`}>
        Change role for {member.name}
      </label>
      <select
        id={`role-${member.id}`}
        value={member.role}
        onChange={(e) => onRoleChange(member.id, e.target.value)}
        disabled={member.role === "Owner"}
        className="focus-ring shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-200 disabled:opacity-40"
      >
        {ROLES.map((r) => (
          <option key={r} value={r} className="bg-void-900 text-slate-100">
            {r}
          </option>
        ))}
      </select>

      <button
        type="button"
        aria-label={`Remove ${member.name}`}
        onClick={() => onRemove(member.id)}
        disabled={member.role === "Owner"}
        className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-rose-300 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer disabled:cursor-not-allowed"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
