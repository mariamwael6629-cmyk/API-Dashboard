import { motion } from "framer-motion";
import { PROVIDERS } from "../../../lib/mockData";

// A tasteful, hand-arranged constellation of glass nodes representing
// connected API providers, linked by animated dashed lines. Purely
// decorative — positions are fixed percentages, not physically simulated.
const NODES = PROVIDERS.slice(0, 6).map((p, i) => ({
  ...p,
  // hand-placed positions around a loose circle
  pos: [
    { x: 50, y: 6 },
    { x: 88, y: 28 },
    { x: 82, y: 74 },
    { x: 50, y: 94 },
    { x: 14, y: 74 },
    { x: 10, y: 28 },
  ][i],
}));

const CENTER = { x: 50, y: 50 };

export default function NetworkVisualization() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {NODES.map((node, i) => (
          <line
            key={node.id}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={node.pos.x}
            y2={node.pos.y}
            stroke="url(#nexora-line-grad)"
            strokeWidth="0.35"
            strokeDasharray="2 2"
            className="animate-dash"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        <defs>
          <linearGradient id="nexora-line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4cf3ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center hub node */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glow-cyan glass-strong absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
      >
        <span className="font-display text-sm font-bold text-gradient-cyan">NEXORA</span>
      </motion.div>

      {/* Orbiting provider nodes */}
      {NODES.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 * i }}
          className="animate-float absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${node.pos.x}%`,
            top: `${node.pos.y}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          <div
            className="glass flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold shadow-lg sm:h-16 sm:w-16"
            style={{ color: node.color, borderColor: `${node.color}40` }}
            title={node.name}
          >
            {node.name.slice(0, 2).toUpperCase()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
