import clsx from "clsx";

export default function SettingsNav({ sections, active, onSelect }) {
  return (
    <nav aria-label="Settings sections" className="glass flex gap-1.5 overflow-x-auto rounded-2xl p-2 lg:flex-col lg:overflow-visible">
      {sections.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-current={active === s.id ? "true" : "false"}
            className={clsx(
              "focus-ring flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-colors cursor-pointer lg:w-full",
              active === s.id
                ? "bg-white/10 text-slate-100"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
