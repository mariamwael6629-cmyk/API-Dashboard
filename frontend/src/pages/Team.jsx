import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import Topbar from "../components/layout/Topbar";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { TEAM_MEMBERS } from "../lib/mockData";
import WorkspaceHeader from "../components/widgets/team/WorkspaceHeader";
import MemberRow from "../components/widgets/team/MemberRow";
import InviteMemberModal from "../components/widgets/team/InviteMemberModal";

const AVATAR_COLORS = ["#4cf3ff", "#a78bfa", "#ff4fd8", "#b6ff3c", "#ffb347"];

export default function Team() {
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);

  const onlineCount = useMemo(() => members.filter((m) => m.status === "online").length, [members]);

  const handleRoleChange = (id, role) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    toast.success("Role updated.");
  };

  const handleRemove = (id) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success(`${member?.name ?? "Member"} removed from workspace.`);
  };

  const handleInvite = ({ email, role }) => {
    const newMember = {
      id: Date.now(),
      name: email.split("@")[0].replace(/[._]/g, " "),
      email,
      role,
      status: "offline",
      avatarColor: AVATAR_COLORS[members.length % AVATAR_COLORS.length],
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteOpen(false);
    toast.success(`Invite sent to ${email}.`);
  };

  return (
    <div className="space-y-6">
      <Topbar title="Team Management" subtitle="Manage members, roles, and real-time presence for your workspace." />

      <WorkspaceHeader memberCount={members.length} onlineCount={onlineCount} />

      <GlassCard className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-semibold text-slate-100">Members ({members.length})</h2>
          <Button size="sm" icon={<UserPlus className="h-3.5 w-3.5" />} onClick={() => setInviteOpen(true)}>
            Invite member
          </Button>
        </div>

        <div className="space-y-2.5">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              onRoleChange={handleRoleChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </GlassCard>

      <InviteMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={handleInvite} />
    </div>
  );
}
