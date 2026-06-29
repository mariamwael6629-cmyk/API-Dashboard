import clsx from "clsx";

const colors = {
  connected: "bg-lime-400",
  online: "bg-lime-400",
  active: "bg-lime-400",
  degraded: "bg-amber-400",
  idle: "bg-amber-400",
  paused: "bg-amber-400",
  disconnected: "bg-slate-500",
  offline: "bg-slate-500",
  error: "bg-rose-400",
};

export default function StatusDot({ status = "offline", pulse = true, className }) {
  return (
    <span className={clsx("relative inline-flex h-2.5 w-2.5", className)}>
      {pulse && (
        <span
          className={clsx(
            "absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
            colors[status] ?? colors.offline
          )}
        />
      )}
      <span
        className={clsx(
          "relative inline-flex h-2.5 w-2.5 rounded-full",
          colors[status] ?? colors.offline
        )}
      />
    </span>
  );
}
