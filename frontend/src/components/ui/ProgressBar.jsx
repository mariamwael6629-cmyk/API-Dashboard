import { motion } from "framer-motion";
import clsx from "clsx";

export default function ProgressBar({ value = 0, max = 100, tone = "cyan", className }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const fill =
    tone === "cyan" ? "bg-cyan-400" : tone === "amber" ? "bg-amber-400" : "bg-lime-400";

  return (
    <div className={clsx("h-2 w-full overflow-hidden rounded-full bg-white/5", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={clsx("h-full rounded-full", fill)}
      />
    </div>
  );
}
