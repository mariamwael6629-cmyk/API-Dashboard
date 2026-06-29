import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import CommandPalette from "./CommandPalette";
import BackgroundFX from "./BackgroundFX";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="relative flex h-screen w-full">
      <BackgroundFX />
      <Sidebar />
      <CommandPalette />
      <main className="relative flex-1 overflow-y-auto px-4 pb-24 pt-3 sm:px-6 lg:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto w-full max-w-[1400px]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav />
    </div>
  );
}
