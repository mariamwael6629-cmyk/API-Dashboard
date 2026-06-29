import { useState } from "react";
import { toast } from "sonner";
import GlassCard from "../../ui/GlassCard";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

export default function ProfileSection({ user }) {
  const [name, setName] = useState(user?.name ?? "Demo User");
  const [email, setEmail] = useState(user?.email ?? "demo@nexora.dev");

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Profile updated.");
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <h2 className="font-display text-sm font-semibold text-slate-100">Profile</h2>
      <form onSubmit={handleSave} className="mt-5 space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-400 font-display text-xl font-semibold text-void-950">
            {name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="text-xs text-slate-400">
            Avatar is generated from your initials.
            <br />
            Custom uploads coming soon.
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </GlassCard>
  );
}
