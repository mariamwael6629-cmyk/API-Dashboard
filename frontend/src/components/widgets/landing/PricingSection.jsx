import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import { PRICING_PLANS } from "../../../lib/mockData";

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-base text-ink-2">
            Start free, scale up when you need more throughput. No surprise invoices.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className={plan.highlight ? "lg:-translate-y-3" : ""}
            >
              <div
                className={`relative flex h-full flex-col rounded-xl border bg-canvas p-7 shadow-sm ${
                  plan.highlight
                    ? "border-brand ring-1 ring-brand/20"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-lg font-semibold text-ink">{plan.name}</h3>
                <p className="mt-1 text-sm text-ink-3">{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-ink">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-ink-3">/mo</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlight ? "primary" : "secondary"}
                  className={`mt-8 w-full ${!plan.highlight ? "border-border text-ink-2 hover:border-brand/40 hover:text-ink" : ""}`}
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
