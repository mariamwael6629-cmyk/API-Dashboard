import { useState } from "react";
import { UserPlus } from "lucide-react";
import ModalDialog from "../../ui/ModalDialog";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const ROLES = ["Admin", "Developer", "Viewer"];

export default function InviteMemberModal({ open, onClose, onInvite }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Developer");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite({ email: email.trim(), role });
    setEmail("");
    setRole("Developer");
  };

  return (
    <ModalDialog open={open} onClose={onClose} title="Invite team member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          required
          placeholder="teammate@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-slate-400">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-void-900 text-slate-100">
                {r}
              </option>
            ))}
          </select>
        </label>
        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" icon={<UserPlus className="h-4 w-4" />}>
            Send invite
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
