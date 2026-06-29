import clsx from "clsx";

export default function Skeleton({ className }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
