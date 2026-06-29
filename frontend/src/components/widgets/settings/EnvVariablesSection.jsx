import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import GlassCard from "../../ui/GlassCard";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const INITIAL_VARS = [
  { id: "v1", key: "OPENAI_API_KEY", value: "sk-••••••••" },
  { id: "v2", key: "STRIPE_WEBHOOK_SECRET", value: "whsec_••••••••" },
];

export default function EnvVariablesSection() {
  const [vars, setVars] = useState(INITIAL_VARS);

  const updateVar = (id, field, value) => {
    setVars((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const addVar = () => {
    setVars((prev) => [...prev, { id: `v_${Date.now()}`, key: "", value: "" }]);
  };

  const removeVar = (id) => {
    setVars((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSave = () => {
    toast.success("Environment variables saved.");
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-sm font-semibold text-slate-100">Environment variables</h2>
        <Button size="sm" variant="secondary" icon={<Plus className="h-3.5 w-3.5" />} onClick={addVar}>
          Add variable
        </Button>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Used by your workflows and the Testing Lab to inject secrets at runtime.
      </p>

      <div className="mt-5 space-y-2.5">
        {vars.map((v) => (
          <div key={v.id} className="flex items-center gap-2">
            <Input
              aria-label="Environment variable key"
              placeholder="VARIABLE_NAME"
              value={v.key}
              onChange={(e) => updateVar(v.id, "key", e.target.value)}
              className="flex-1 font-mono"
            />
            <Input
              aria-label="Environment variable value"
              placeholder="value"
              value={v.value}
              onChange={(e) => updateVar(v.id, "value", e.target.value)}
              className="flex-1 font-mono"
            />
            <button
              type="button"
              aria-label="Remove variable"
              onClick={() => removeVar(v.id)}
              className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:text-rose-300 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {vars.length === 0 && <p className="text-sm text-slate-500">No environment variables defined yet.</p>}
      </div>

      <Button variant="secondary" size="sm" className="mt-5" onClick={handleSave}>
        Save variables
      </Button>
    </GlassCard>
  );
}
