import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
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
  ChevronsLeft,
  Hexagon,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/app/marketplace", label: "Marketplace", icon: Store },
  { to: "/app/analytics", label: "Analytics", icon: LineChart },
  { to: "/app/workflows", label: "Workflows", icon: Workflow },
  { to: "/app/testing-lab", label: "Testing Lab", icon: FlaskConical },
  { to: "/app/team", label: "Team", icon: Users },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
  { to: "/app/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 84 : 248 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="relative z-20 m-3 hidden shrink-0 flex-col rounded-3xl glass-strong p-3 lg:flex"
    >
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-400 to-fuchsia-400">
          <Hexagon className="h-5 w-5 text-void-950" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-semibold tracking-tight text-slate-100">
            Nexora
          </span>
        )}
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "focus-ring group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "text-slate-50"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl glass glow-cyan"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {!collapsed && <span className="relative z-10 truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggleSidebar}
        className="focus-ring flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs text-slate-500 hover:bg-white/5 hover:text-slate-200 cursor-pointer"
      >
        <ChevronsLeft
          className={clsx("h-4 w-4 transition-transform", collapsed && "rotate-180")}
        />
        {!collapsed && "Collapse"}
      </button>
    </motion.aside>
  );
}
