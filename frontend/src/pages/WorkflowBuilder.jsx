import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Save, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Topbar from "../components/layout/Topbar";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { WORKFLOWS } from "../lib/mockData";
import NodePalette from "../components/widgets/workflows/NodePalette";
import WorkflowList from "../components/widgets/workflows/WorkflowList";
import WorkflowCanvas from "../components/widgets/workflows/WorkflowCanvas";
import { NODE_TYPES, DEMO_LAYOUTS, DEMO_EDGES, nextNodeId } from "../components/widgets/workflows/nodeTypes";

const CANVAS_SIZE = { w: 1400, h: 520 };

export default function WorkflowBuilder() {
  const [activeWorkflowId, setActiveWorkflowId] = useState(WORKFLOWS[0]?.id ?? null);
  const [nodes, setNodes] = useState(() => DEMO_LAYOUTS[WORKFLOWS[0]?.id] ?? []);
  const [edges, setEdges] = useState(() => DEMO_EDGES[WORKFLOWS[0]?.id] ?? []);
  const [running, setRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(null);

  const activeWorkflow = useMemo(
    () => WORKFLOWS.find((w) => w.id === activeWorkflowId) ?? null,
    [activeWorkflowId]
  );

  const handleOpenWorkflow = useCallback((wf) => {
    setActiveWorkflowId(wf.id);
    setNodes(DEMO_LAYOUTS[wf.id] ?? []);
    setEdges(DEMO_EDGES[wf.id] ?? []);
    setActiveNodeId(null);
  }, []);

  const handleAddNode = useCallback((type) => {
    const def = NODE_TYPES[type];
    setNodes((prev) => [
      ...prev,
      {
        id: nextNodeId(),
        type,
        label: def?.label ?? "New Node",
        x: 80 + ((prev.length * 40) % 400),
        y: 60 + ((prev.length * 70) % 360),
      },
    ]);
  }, []);

  const handleDragNode = useCallback((id, info) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              x: Math.max(0, Math.min(CANVAS_SIZE.w - 196, n.x + info.delta.x)),
              y: Math.max(0, Math.min(CANVAS_SIZE.h - 64, n.y + info.delta.y)),
            }
          : n
      )
    );
  }, []);

  const handleRemoveNode = useCallback((id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter(([from, to]) => from !== id && to !== id));
  }, []);

  const handleRun = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error("Add at least one node before running.");
      return;
    }
    setRunning(true);
    toast.info(`Running "${activeWorkflow?.name ?? "Untitled workflow"}"...`);

    // Simulated sequential execution: highlight each node in turn.
    const order = topologicalOrder(nodes, edges);
    for (const nodeId of order) {
      setActiveNodeId(nodeId);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 550));
    }
    setActiveNodeId(null);
    setRunning(false);
    toast.success("Workflow run completed.");
  }, [nodes, edges, activeWorkflow]);

  const handleSave = useCallback(() => {
    toast.success("Workflow saved (local demo — not yet persisted to backend).");
  }, []);

  return (
    <div className="space-y-6">
      <Topbar
        title="Workflow Builder"
        subtitle="Drag, wire, and run automated pipelines across your connected APIs."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-base font-semibold text-slate-100">
            {activeWorkflow?.name ?? "Untitled Workflow"}
          </h2>
          <span className="text-xs text-slate-500">{nodes.length} nodes</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" icon={<Save className="h-3.5 w-3.5" />} onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            onClick={handleRun}
            disabled={running}
          >
            {running ? "Running..." : "Run workflow"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        <div className="space-y-5">
          <NodePalette onAddNode={handleAddNode} />
          <WorkflowList workflows={WORKFLOWS} activeId={activeWorkflowId} onOpen={handleOpenWorkflow} />
        </div>

        <GlassCard className="overflow-x-auto p-3 sm:p-4">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            activeNodeId={activeNodeId}
            onDragNode={handleDragNode}
            onRemoveNode={handleRemoveNode}
            canvasSize={CANVAS_SIZE}
          />
        </GlassCard>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-xs text-slate-500"
      >
        <Plus className="h-3.5 w-3.5" /> Tip: click a palette item to drop a node, then drag it anywhere on the
        canvas.
      </motion.p>
    </div>
  );
}

// Simple BFS-from-roots traversal so "Run workflow" highlights nodes in a
// sensible order even for branching graphs (roots = nodes with no incoming edge).
function topologicalOrder(nodes, edges) {
  const incoming = new Set(edges.map(([, to]) => to));
  const roots = nodes.filter((n) => !incoming.has(n.id)).map((n) => n.id);
  const visited = new Set();
  const order = [];
  const queue = roots.length ? [...roots] : nodes.map((n) => n.id);

  while (queue.length) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    edges.forEach(([from, to]) => {
      if (from === id && !visited.has(to)) queue.push(to);
    });
  }
  nodes.forEach((n) => {
    if (!visited.has(n.id)) order.push(n.id);
  });
  return order;
}
