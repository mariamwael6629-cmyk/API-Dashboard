import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, KeyRound, Link2, ListPlus, Plus, Trash2 } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const METHODS = [
  { id: "api_key", label: "API Key", icon: KeyRound },
  { id: "oauth", label: "OAuth", icon: Link2 },
  { id: "header", label: "Custom Headers", icon: ListPlus },
];

export default function ConnectionModal({ provider, onClose }) {
  const [method, setMethod] = useState(provider?.auth ?? "api_key");
  const [apiKey, setApiKey] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const dialogRef = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    // basic focus on open
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // GlassCard doesn't forward refs (it renders a motion.div internally),
  // so the dialog focus/role semantics live on this wrapping div instead.

  if (!provider) return null;

  function handleSave(e) {
    e.preventDefault();
    toast.success(`${provider.name} connection saved`, {
      description: `Authentication method: ${METHODS.find((m) => m.id === method)?.label}`,
    });
    onClose();
  }

  function updateHeader(i, field, value) {
    setHeaders((prev) => prev.map((h, idx) => (idx === i ? { ...h, [field]: value } : h)));
  }

  function addHeaderRow() {
    setHeaders((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeHeaderRow(i) {
    setHeaders((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="presentation"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg"
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="connection-modal-title"
            className="focus:outline-none"
          >
          <GlassCard strong glow="cyan" className="max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                  style={{ backgroundColor: `${provider.color}22`, color: provider.color }}
                >
                  {provider.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h2 id="connection-modal-title" className="font-display text-lg font-semibold text-slate-100">
                    Configure {provider.name}
                  </h2>
                  <p className="text-xs text-slate-500">Choose an authentication method</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="focus-ring glass flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="glass mt-6 grid grid-cols-3 gap-1 rounded-xl p-1">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`focus-ring relative flex flex-col items-center gap-1 rounded-lg py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                      active ? "text-void-950" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-method-pill"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{m.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              {method === "api_key" && (
                <Input
                  label="API Key"
                  type="password"
                  required
                  placeholder="sk_live_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  aria-label="API key"
                />
              )}

              {method === "oauth" && (
                <>
                  <Input
                    label="Client ID"
                    required
                    placeholder="client_id_xxxxx"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                  <Input
                    label="Client Secret"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                  />
                </>
              )}

              {method === "header" && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-400">Custom Headers</span>
                  {headers.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50"
                        placeholder="Header-Name"
                        value={h.key}
                        onChange={(e) => updateHeader(i, "key", e.target.value)}
                        aria-label={`Header name ${i + 1}`}
                      />
                      <input
                        className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50"
                        placeholder="value"
                        value={h.value}
                        onChange={(e) => updateHeader(i, "value", e.target.value)}
                        aria-label={`Header value ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeHeaderRow(i)}
                        aria-label={`Remove header ${i + 1}`}
                        className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:text-rose-300 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addHeaderRow}
                    className="focus-ring flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-cyan-300 hover:text-cyan-200 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add header
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Save Connection
                </Button>
              </div>
            </form>
          </GlassCard>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
