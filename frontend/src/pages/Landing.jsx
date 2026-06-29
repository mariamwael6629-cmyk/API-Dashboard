import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Menu, X, ArrowRight, BookOpen, GitFork, MessageCircle } from "lucide-react";
import Button from "../components/ui/Button";
import NetworkVisualization from "../components/widgets/landing/NetworkVisualization";
import FeatureSection from "../components/widgets/landing/FeatureSection";
import PricingSection from "../components/widgets/landing/PricingSection";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-void-950 text-slate-200">
      {/* Background FX scoped to this standalone page */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        <div className="animate-float absolute -left-32 top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="animate-float absolute right-[-10%] top-[20%] h-[480px] w-[480px] rounded-full bg-violet-500/20 blur-[120px] [animation-delay:1.2s]" />
        <div className="animate-float absolute bottom-[-15%] left-[30%] h-[420px] w-[420px] rounded-full bg-fuchsia-500/15 blur-[120px] [animation-delay:2.4s]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-void-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2 focus-ring rounded-lg" aria-label="Nexora home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-400 to-fuchsia-400">
              <Hexagon className="h-5 w-5 text-void-950" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-slate-100">
              Nexora
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="focus-ring rounded-md text-sm font-medium text-slate-400 transition-colors hover:text-slate-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="focus-ring rounded-xl">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/login" className="focus-ring rounded-xl">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="focus-ring glass flex h-10 w-10 items-center justify-center rounded-xl text-slate-200 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/5 md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring rounded-lg px-2 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Now supporting 40+ API providers
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            One dashboard to <span className="text-gradient-cyan">aggregate</span> every API
            you ship with
          </h1>

          <p className="mt-6 max-w-lg text-base text-slate-400 sm:text-lg">
            Nexora unifies connections, monitoring, workflows and billing for every third-party
            API your product depends on — with real-time observability and an AI co-pilot
            built in.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/login">
              <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                Get Started
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" icon={<BookOpen className="h-4 w-4" />}>
                View Docs
              </Button>
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-slate-500">
            <div>
              <div className="font-display text-2xl font-semibold text-slate-100">99.99%</div>
              uptime SLA
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="font-display text-2xl font-semibold text-slate-100">2.4M+</div>
              requests / day routed
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="font-display text-2xl font-semibold text-slate-100">40+</div>
              providers supported
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <NetworkVisualization />
        </motion.div>
      </section>

      <div id="features">
        <FeatureSection />
      </div>

      <PricingSection />

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="glass-strong glow-violet flex flex-col items-center gap-6 rounded-3xl px-8 py-14 text-center"
        >
          <h2 className="font-display text-3xl font-semibold text-slate-50 sm:text-4xl">
            Ready to unify your API stack?
          </h2>
          <p className="max-w-xl text-slate-400">
            Spin up your Nexora workspace in minutes — no credit card required for the Starter
            plan.
          </p>
          <Link to="/login">
            <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="docs" className="border-t border-white/5 px-6 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-violet-400 to-fuchsia-400">
              <Hexagon className="h-4 w-4 text-void-950" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold text-slate-300">
              Nexora &copy; {new Date().getFullYear()}
            </span>
          </div>

          <p className="text-center text-xs text-slate-500">
            Built for teams who ship fast across a fragmented API landscape.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Nexora on GitHub"
              className="focus-ring glass flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-slate-100"
            >
              <GitFork className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Nexora community chat"
              className="focus-ring glass flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-slate-100"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
