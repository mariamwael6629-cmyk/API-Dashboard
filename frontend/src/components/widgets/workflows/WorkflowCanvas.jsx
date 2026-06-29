import { useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { NODE_TYPES } from "./nodeTypes";

const NODE_W = 196;
const NODE_H = 64;

function edgePath(from, to) {
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  const dx = Math.max(60, (x2 - x1) / 2);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export default function WorkflowCanvas({
  nodes,
  edges,
  activeNodeId,
  onDragNode,
  onRemoveNode,
  canvasSize,
}) {
  const canvasRef = useRef(null);

  return (
    <div
      ref={canvasRef}
      className="glass bg-grid relative h-[520px] w-full min-w-[900px] overflow-hidden rounded-2xl border border-white/10"
      style={{ width: canvasSize.w, height: canvasSize.h }}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <marker
            id="wf-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(76,243,255,0.55)" />
          </marker>
        </defs>
        {edges.map(([fromId, toId], i) => {
          const from = nodes.find((n) => n.id === fromId);
          const to = nodes.find((n) => n.id === toId);
          if (!from || !to) return null;
          const isActive = activeNodeId === fromId || activeNodeId === toId;
          return (
            <path
              key={`${fromId}-${toId}-${i}`}
              d={edgePath(from, to)}
              fill="none"
              stroke={isActive ? "rgba(76,243,255,0.9)" : "rgba(255,255,255,0.18)"}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeDasharray={isActive ? "6 4" : "none"}
              className={isActive ? "animate-dash" : ""}
              markerEnd="url(#wf-arrow)"
            />
          );
        })}
      </svg>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
          Add nodes from the palette to start building your workflow.
        </div>
      )}

      {nodes.map((node) => {
        const def = NODE_TYPES[node.type] ?? NODE_TYPES.api_call;
        const Icon = def.icon;
        const isActive = activeNodeId === node.id;
        return (
          <motion.div
            key={node.id}
            drag
            dragMomentum={false}
            dragConstraints={canvasRef}
            onDrag={(_, info) => onDragNode(node.id, info)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: isActive ? 1.06 : 1,
              x: node.x,
              y: node.y,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            style={{ position: "absolute", width: NODE_W }}
            className="cursor-grab touch-none active:cursor-grabbing"
          >
            <div
              className={`glass-strong group relative rounded-xl border px-3.5 py-3 transition-shadow ${
                isActive ? "shadow-[0_0_30px_-4px_var(--tw-shadow-color)]" : ""
              }`}
              style={{
                borderColor: isActive ? def.accent : "rgba(255,255,255,0.12)",
                "--tw-shadow-color": def.accent,
              }}
            >
              <button
                type="button"
                aria-label={`Remove ${node.label} node`}
                onClick={() => onRemoveNode(node.id)}
                className="focus-ring absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-rose-500/80 text-white group-hover:flex"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${def.accent}1a`, color: def.accent }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-100">{node.label}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">{def.label}</p>
                </div>
              </div>
              <span
                className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-void-900"
                style={{ backgroundColor: def.accent }}
              />
              <span
                className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-void-900"
                style={{ backgroundColor: def.accent }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
