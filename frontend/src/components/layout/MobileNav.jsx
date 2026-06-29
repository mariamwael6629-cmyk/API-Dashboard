import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { LayoutGrid, Store, LineChart, Sparkles, Menu } from "lucide-react";
import { useUIStore } from "../../store/uiStore";

const ITEMS = [
  { to: "/app", label: "Home", icon: LayoutGrid, end: true },
  { to: "/app/marketplace", label: "APIs", icon: Store },
  { to: "/app/analytics", label: "Analytics", icon: LineChart },
  { to: "/app/assistant", label: "AI", icon: Sparkles },
];

export default function MobileNav() {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);

  return (
    <nav className="glass-strong fixed inset-x-3 bottom-3 z-30 flex items-center justify-between rounded-2xl px-2 py-2 lg:hidden">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              "focus-ring flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px]",
              isActive ? "text-cyan-300" : "text-slate-500"
            )
          }
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="focus-ring flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] text-slate-500 cursor-pointer"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
        More
      </button>
    </nav>
  );
}
