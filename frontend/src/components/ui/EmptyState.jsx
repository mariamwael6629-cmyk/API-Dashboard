import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 animate-glow-pulse rounded-full bg-cyan-400/30" />
        <div className="glass-strong relative flex h-16 w-16 items-center justify-center rounded-2xl">
          {Icon && <Icon className="h-7 w-7 text-cyan-300" strokeWidth={1.5} />}
        </div>
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display text-base font-semibold text-slate-100">{title}</h3>
        {description && <p className="max-w-sm text-sm text-slate-400">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
