import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// Generic accessible modal: closes on Escape or backdrop click, never traps focus.
// Distinct filename from any existing component to avoid touching shared files.
export default function ModalDialog({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void-950/70 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            className={`glass-strong w-full max-w-md rounded-2xl p-6 ${className ?? ""}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-slate-100">{title}</h3>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
