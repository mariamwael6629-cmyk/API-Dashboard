import clsx from "clsx";

export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange?.(!checked)}
      className={clsx(
        "focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer",
        checked ? "bg-gradient-to-r from-cyan-400 to-violet-400" : "bg-white/10"
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
