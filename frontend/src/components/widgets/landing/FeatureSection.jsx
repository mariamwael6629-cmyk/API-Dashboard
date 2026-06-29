import { motion } from "framer-motion";
import { Workflow, ShieldCheck, Gauge, Sparkles, Boxes } from "lucide-react";
import GlassCard from "../../ui/GlassCard";

const FEATURES = [
  {
    icon: Boxes,
    title: "Unify every API in one place",
    description:
      "Connect OpenAI, Stripe, GitHub, Slack and dozens more behind a single, consistent interface — no more juggling SDKs and auth flows.",
    glow: "cyan",
  },
  {
    icon: Gauge,
    title: "Real-time observability",
    description:
      "Live traffic, latency heatmaps and error-rate tracking update as requests happen, so you see problems before your users do.",
    glow: "violet",
  },
  {
    icon: Workflow,
    title: "Visual workflow builder",
    description:
      "Chain providers into automated workflows — webhook routers, enrichment pipelines, lead qualifiers — without writing glue code.",
    glow: "magenta",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    description:
      "Granular team roles, audit logs and encrypted credential storage keep every connection locked down and compliant.",
    glow: "cyan",
  },
  {
    icon: Sparkles,
    title: "AI co-pilot built in",
    description:
      "Ask Nexora's assistant to debug a failing call, suggest rate-limit strategies, or draft a new integration in seconds.",
    glow: "violet",
  },
];

export default function FeatureSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <h2 className="font-display text-3xl font-semibold text-slate-50 sm:text-4xl">
          Everything your platform team needs
        </h2>
        <p className="mt-3 text-slate-400">
          Nexora replaces a tangle of dashboards, scripts and Postman collections with one
          coherent control plane for every external API you depend on.
        </p>
      </motion.div>

      <div className="space-y-6">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          const reversed = i % 2 === 1;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
            >
              <GlassCard
                glow={feature.glow}
                className={`flex flex-col items-center gap-6 p-6 sm:p-8 md:flex-row ${
                  reversed ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="glass-strong flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
                  <Icon className="h-7 w-7 text-cyan-300" strokeWidth={1.5} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-display text-lg font-semibold text-slate-100 sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-400 sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
