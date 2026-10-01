import { motion } from "framer-motion";
import clsx from "clsx";

export default function GlassCard({
  children,
  className,
  strong = false,
  glow,
  as: Component = motion.div,
  ...props
}) {
  return (
    <Component
      className={clsx(
        "relative rounded-xl",
        "bg-void-800 border border-white/8",
        strong && "bg-void-700",
        glow === "cyan" && "glow-cyan",
        glow === "violet" && "glow-violet",
        glow === "magenta" && "glow-magenta",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
