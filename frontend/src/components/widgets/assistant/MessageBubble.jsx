import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import clsx from "clsx";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("flex items-start gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={clsx(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser ? "bg-violet-400/15 text-violet-300" : "bg-cyan-400/15 text-cyan-300"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div
        className={clsx(
          "glass max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-slate-200 whitespace-pre-line",
          isUser ? "rounded-tr-sm" : "rounded-tl-sm"
        )}
      >
        {content}
      </div>
    </motion.div>
  );
}
