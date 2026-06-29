import clsx from "clsx";

export default function Input({ label, className, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-xs font-medium text-slate-400">{label}</span>}
      <input
        className={clsx(
          "focus-ring w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-cyan-400/50",
          className
        )}
        {...props}
      />
    </label>
  );
}
