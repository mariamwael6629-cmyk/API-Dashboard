import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hexagon,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  GitFork,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import Button from "../components/ui/Button";
import NetworkVisualization from "../components/widgets/landing/NetworkVisualization";
import FeatureSection from "../components/widgets/landing/FeatureSection";
import PricingSection from "../components/widgets/landing/PricingSection";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

const STATS = [
  { value: "99.99%", label: "uptime SLA" },
  { value: "2.4M+", label: "requests / day" },
  { value: "40+", label: "API providers" },
];

const TRUST_BADGES = [
  "SOC 2 Type II",
  "GDPR Ready",
  "ISO 27001",
  "99.99% Uptime",
];

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-canvas text-ink">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 focus-ring rounded-lg"
            aria-label="Nexora home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <Hexagon className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-semibold tracking-tight text-ink">
              Nexora
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="focus-ring rounded-md text-sm font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="focus-ring rounded-lg">
              <Button variant="ghost" size="sm" className="text-ink-2 hover:text-ink hover:bg-surface">
                Sign In
              </Button>
            </Link>
            <Link to="/login" className="focus-ring rounded-lg">
              <Button variant="primary" size="sm">
                Get started free
              </Button>
            </Link>
          </div>

          <button
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-ink-2 md:hidden cursor-pointer"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              <div className="flex flex-col gap-1 bg-canvas px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="focus-ring rounded-lg px-2 py-2.5 text-sm font-medium text-ink-2 hover:bg-surface hover:text-ink"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full text-ink-2">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Get started free
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ── */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-bg px-3.5 py-1.5 text-xs font-medium text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Now supporting 40+ API providers
          </span>

          <h1 className="mt-7 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
            One dashboard to{" "}
            <span className="text-brand">aggregate</span> every API you ship with
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-2 sm:text-lg">
            Nexora unifies connections, monitoring, workflows and billing for every third-party
            API your product depends on — with real-time observability and an AI co-pilot
            built in.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/login">
              <Button variant="primary" size="lg">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="ghost"
                size="lg"
                className="border border-border text-ink-2 hover:bg-surface hover:text-ink"
              >
                <BookOpen className="h-4 w-4" />
                View docs
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 text-xs text-ink-3"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="rounded-2xl border border-border bg-void-950 p-2 shadow-xl"
        >
          <NetworkVisualization />
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
          <dl className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-0 sm:divide-x sm:divide-border">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 sm:px-14">
                <dt className="font-display text-3xl font-bold text-ink">{stat.value}</dt>
                <dd className="text-sm text-ink-3">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Features ── */}
      <div id="features" className="bg-canvas">
        <FeatureSection />
      </div>

      {/* ── Pricing ── */}
      <PricingSection />

      {/* ── CTA ── */}
      <section className="bg-canvas px-6 py-20 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl rounded-2xl border border-brand/20 bg-brand-bg px-10 py-16 text-center"
        >
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Ready to unify your API stack?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-2">
            Spin up your Nexora workspace in minutes — no credit card required for the
            Starter plan.
          </p>
          <Link to="/login" className="mt-8 inline-block">
            <Button variant="primary" size="lg">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer id="docs" className="border-t border-border bg-surface px-6 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
              <Hexagon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold text-ink">
              Nexora &copy; {new Date().getFullYear()}
            </span>
          </div>

          <p className="text-center text-xs text-ink-3">
            Built for teams who ship fast across a fragmented API landscape.
          </p>

          <div className="flex items-center gap-2">
            <a
              href="#"
              aria-label="Nexora on GitHub"
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-canvas text-ink-3 transition-colors hover:border-ink-3 hover:text-ink"
            >
              <GitFork className="h-3.5 w-3.5" />
            </a>
            <a
              href="#"
              aria-label="Nexora community chat"
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-canvas text-ink-3 transition-colors hover:border-ink-3 hover:text-ink"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
