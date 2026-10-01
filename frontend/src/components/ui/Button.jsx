import clsx from "clsx";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-brand text-white font-semibold hover:bg-brand-dark shadow-sm transition-colors",
  secondary:
    "bg-transparent border border-white/12 text-slate-300 hover:border-brand/40 hover:text-slate-100 transition-colors",
  ghost:
    "bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors",
  danger:
    "bg-rose-500/12 text-rose-300 border border-rose-500/25 hover:bg-rose-500/20 transition-colors",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  as = "button",
  ...props
}) {
  const Component = motion[as] ?? motion.button;
  return (
    <Component
      whileTap={{ scale: 0.98 }}
      className={clsx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Component>
  );
}
