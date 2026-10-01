import { motion } from "framer-motion";
import { Workflow, ShieldCheck, Gauge, Sparkles, Boxes } from "lucide-react";

const FEATURES = [
  {
    icon: Boxes,
    title: "Unify every API in one place",
    description:
      "Connect OpenAI, Stripe, GitHub, Slack and dozens more behind a single, consistent interface — no more juggling SDKs and auth flows.",
  },
  {
    icon: Gauge,
    title: "Real-time observability",
    description:
      "Live traffic, latency heatmaps and error-rate tracking update as requests happen, so you see problems before your users do.",
  },
  {
    icon: Workflow,
    title: "Visual workflow builder",
    description:
      "Chain providers into automated workflows — webhook routers, enrichment pipelines, lead qualifiers — without writing glue code.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    description:
      "Granular team roles, audit logs and encrypted credential storage keep every connection locked down and compliant.",
  },
  {
    icon: Sparkles,
    title: "AI co-pilot built in",
    description:
      "Ask Nexora's assistant to debug a failing call, suggest rate-limit strategies, or draft a new integration in seconds.",
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
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          Everything your platform team needs
        </h2>
        <p className="mt-4 text-base text-ink-2">
          Nexora replaces a tangle of dashboards, scripts and Postman collections with one
          coherent control plane for every external API you depend on.
        </p>
      </motion.div>

      <div className="space-y-4">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          const reversed = i % 2 === 1;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              className={`flex flex-col items-center gap-6 rounded-xl border border-border bg-canvas px-6 py-7 shadow-sm sm:px-8 md:flex-row ${
                reversed ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-bg border border-brand-border">
                <Icon className="h-6 w-6 text-brand" strokeWidth={1.75} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-2 sm:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
