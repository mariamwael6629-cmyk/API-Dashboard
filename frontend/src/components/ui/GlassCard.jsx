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
        "relative rounded-2xl",
        strong ? "glass-strong" : "glass",
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
