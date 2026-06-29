import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="glass flex items-center gap-1.5 rounded-2xl rounded-tl-sm px-4 py-3.5" aria-label="Assistant is typing">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-cyan-300"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
