import { useState } from "react";
import { Copy, KeyRound, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import GlassCard from "../../ui/GlassCard";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";

function maskKey(key) {
  return `${key.slice(0, 6)}${"•".repeat(8)}${key.slice(-4)}`;
}

function randomKey() {
  return `sk-${Array.from({ length: 24 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("")}`;
}

const INITIAL_KEYS = [
  { id: "key_1", label: "Production", value: randomKey(), createdAt: "Jan 14, 2026" },
  { id: "key_2", label: "Staging", value: randomKey(), createdAt: "Mar 02, 2026" },
];

export default function ApiKeysSection() {
  const [keys, setKeys] = useState(INITIAL_KEYS);

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("API key copied to clipboard.");
    } catch {
      toast.error("Couldn't copy to clipboard.");
    }
  };

  const handleGenerate = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      label: `Key ${keys.length + 1}`,
      value: randomKey(),
      createdAt: new Date().toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }),
    };
    setKeys((prev) => [...prev, newKey]);
    toast.success("New API key generated.");
  };

  const handleRevoke = (id) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("API key revoked.");
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-sm font-semibold text-slate-100">API Keys</h2>
        <Button size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={handleGenerate}>
          Generate new key
        </Button>
      </div>

      <div className="mt-5 space-y-2.5">
        {keys.map((k) => (
          <div
            key={k.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-100">{k.label}</p>
                <p className="font-mono text-xs text-slate-400">{maskKey(k.value)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="slate">Created {k.createdAt}</Badge>
              <button
                type="button"
                aria-label={`Copy ${k.label} key`}
                onClick={() => handleCopy(k.value)}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Revoke ${k.label} key`}
                onClick={() => handleRevoke(k.id)}
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-rose-300 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {keys.length === 0 && <p className="text-sm text-slate-500">No API keys yet — generate one to get started.</p>}
      </div>
    </GlassCard>
  );
}
