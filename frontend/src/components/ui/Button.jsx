import clsx from "clsx";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 text-void-950 font-semibold shadow-[0_0_24px_-4px_rgba(76,243,255,0.6)]",
  secondary: "glass text-slate-100 hover:border-white/20",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5",
  danger: "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25",
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-xl transition-colors cursor-pointer",
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
