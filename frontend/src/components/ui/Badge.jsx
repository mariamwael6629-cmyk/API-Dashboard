import clsx from "clsx";

const tones = {
  cyan: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
  violet: "bg-violet-400/10 text-violet-300 border-violet-400/30",
  magenta: "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/30",
  lime: "bg-lime-400/10 text-lime-300 border-lime-400/30",
  amber: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  rose: "bg-rose-400/10 text-rose-300 border-rose-400/30",
  slate: "bg-slate-400/10 text-slate-300 border-slate-400/30",
};

export default function Badge({ children, tone = "slate", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
