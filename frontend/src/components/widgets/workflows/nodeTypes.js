import { Zap, Globe, Shuffle, GitBranch, FlagTriangleRight } from "lucide-react";

// Shared catalogue of draggable node types for the Workflow Builder palette + canvas.
export const NODE_TYPES = {
  trigger: {
    type: "trigger",
    label: "Trigger",
    icon: Zap,
    tone: "lime",
    accent: "#b6ff3c",
    description: "Starts the workflow",
  },
  api_call: {
    type: "api_call",
    label: "API Call",
    icon: Globe,
    tone: "cyan",
    accent: "#4cf3ff",
    description: "Calls a connected provider",
  },
  transform: {
    type: "transform",
    label: "Transform",
    icon: Shuffle,
    tone: "violet",
    accent: "#a78bfa",
    description: "Maps / reshapes payload",
  },
  condition: {
    type: "condition",
    label: "Condition",
    icon: GitBranch,
    tone: "amber",
    accent: "#ffb347",
    description: "Branches on a rule",
  },
  output: {
    type: "output",
    label: "Output",
    icon: FlagTriangleRight,
    tone: "magenta",
    accent: "#ff4fd8",
    description: "Final destination / response",
  },
};

export const NODE_TYPE_LIST = Object.values(NODE_TYPES);

// Demo node layouts keyed by workflow id, so "opening" a saved workflow
// populates the canvas with a believable, already-wired pipeline.
export const DEMO_LAYOUTS = {
  wf_1: [
    { id: "n1", type: "trigger", label: "New Ticket", x: 60, y: 160 },
    { id: "n2", type: "api_call", label: "Fetch Customer (CRM)", x: 320, y: 60 },
    { id: "n3", type: "api_call", label: "Sentiment (OpenAI)", x: 320, y: 260 },
    { id: "n4", type: "transform", label: "Merge Context", x: 600, y: 160 },
    { id: "n5", type: "output", label: "Post to Slack", x: 860, y: 160 },
  ],
  wf_2: [
    { id: "n1", type: "trigger", label: "Stripe Webhook", x: 60, y: 140 },
    { id: "n2", type: "condition", label: "Amount > $500?", x: 320, y: 140 },
    { id: "n3", type: "api_call", label: "Notify Finance", x: 600, y: 40 },
    { id: "n4", type: "output", label: "Log to Sheet", x: 600, y: 260 },
  ],
  wf_3: [
    { id: "n1", type: "trigger", label: "New Lead Form", x: 60, y: 180 },
    { id: "n2", type: "api_call", label: "Enrich (Clearbit)", x: 280, y: 60 },
    { id: "n3", type: "api_call", label: "Score (OpenAI)", x: 280, y: 300 },
    { id: "n4", type: "transform", label: "Build Lead Record", x: 540, y: 180 },
    { id: "n5", type: "condition", label: "Score > 70?", x: 780, y: 180 },
    { id: "n6", type: "output", label: "Push to CRM", x: 1020, y: 80 },
    { id: "n7", type: "output", label: "Drip Campaign", x: 1020, y: 300 },
  ],
};

export const DEMO_EDGES = {
  wf_1: [
    ["n1", "n2"],
    ["n1", "n3"],
    ["n2", "n4"],
    ["n3", "n4"],
    ["n4", "n5"],
  ],
  wf_2: [
    ["n1", "n2"],
    ["n2", "n3"],
    ["n2", "n4"],
  ],
  wf_3: [
    ["n1", "n2"],
    ["n1", "n3"],
    ["n2", "n4"],
    ["n3", "n4"],
    ["n4", "n5"],
    ["n5", "n6"],
    ["n5", "n7"],
  ],
};

let idCounter = 1000;
export function nextNodeId() {
  idCounter += 1;
  return `node_${idCounter}`;
}
