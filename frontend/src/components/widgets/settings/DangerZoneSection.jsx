import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import GlassCard from "../../ui/GlassCard";
import Button from "../../ui/Button";
import ModalDialog from "../../ui/ModalDialog";

export default function DangerZoneSection() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    setConfirmOpen(false);
    setConfirmText("");
    toast.success("Workspace deletion scheduled (demo only — no data was actually deleted).");
  };

  return (
    <GlassCard className="border border-rose-500/20 p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
        <h2 className="font-display text-sm font-semibold text-rose-300">Danger Zone</h2>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
        <div>
          <p className="text-sm font-medium text-slate-100">Delete workspace</p>
          <p className="text-xs text-slate-400">
            Permanently deletes this workspace, its members, workflows, and API keys. This cannot be undone.
          </p>
        </div>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete workspace
        </Button>
      </div>

      <ModalDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete workspace">
        <p className="text-sm text-slate-300">
          This will permanently delete the <strong>Nexora Workspace</strong> and all of its data. Type{" "}
          <span className="font-mono text-rose-300">DELETE</span> to confirm.
        </p>
        <input
          aria-label="Type DELETE to confirm"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="focus-ring mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100"
          placeholder="DELETE"
        />
        <div className="mt-5 flex justify-end gap-2.5">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" disabled={confirmText !== "DELETE"} onClick={handleDelete}>
            Permanently delete
          </Button>
        </div>
      </ModalDialog>
    </GlassCard>
  );
}
