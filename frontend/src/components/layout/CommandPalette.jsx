import { Command } from "cmdk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Store,
  LineChart,
  Workflow,
  FlaskConical,
  Users,
  CreditCard,
  Sparkles,
  Settings,
  Terminal,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";

const ACTIONS = [
  { id: "dashboard", label: "Go to Dashboard", to: "/app", icon: LayoutGrid },
  { id: "marketplace", label: "Go to API Marketplace", to: "/app/marketplace", icon: Store },
  { id: "analytics", label: "Go to Analytics Center", to: "/app/analytics", icon: LineChart },
  { id: "workflows", label: "Go to Workflow Builder", to: "/app/workflows", icon: Workflow },
  { id: "testing", label: "Go to API Testing Lab", to: "/app/testing-lab", icon: FlaskConical },
  { id: "team", label: "Go to Team Management", to: "/app/team", icon: Users },
  { id: "billing", label: "Go to Billing & Subscription", to: "/app/billing", icon: CreditCard },
  { id: "assistant", label: "Ask the AI Assistant", to: "/app/assistant", icon: Sparkles },
  { id: "settings", label: "Go to Settings", to: "/app/settings", icon: Settings },
];

export default function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-void-950/70 backdrop-blur-sm pt-[14vh]"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
          >
            <Command className="bg-transparent">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <Terminal className="h-4 w-4 text-cyan-300" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                />
                <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center text-sm text-slate-500">
                  No results found.
                </Command.Empty>
                {ACTIONS.map(({ id, label, to, icon: Icon }) => (
                  <Command.Item
                    key={id}
                    value={label}
                    onSelect={() => {
                      navigate(to);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 data-[selected=true]:bg-white/8 data-[selected=true]:text-slate-50"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    {label}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
