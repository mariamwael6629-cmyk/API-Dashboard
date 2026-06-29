import { motion } from "framer-motion";
import { Clock, Inbox } from "lucide-react";
import Badge from "../../ui/Badge";
import EmptyState from "../../ui/EmptyState";
import JsonViewer from "./JsonViewer";

function statusTone(status) {
  if (status >= 200 && status < 300) return "lime";
  if (status >= 400 && status < 500) return "amber";
  if (status >= 500) return "rose";
  return "slate";
}

export default function ResponsePanel({ response }) {
  if (!response) {
    return (
      <EmptyState
        icon={Inbox}
        title="No response yet"
        description="Send a request to see the status, latency, and JSON response here."
      />
    );
  }

  return (
    <motion.div
      key={response.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={statusTone(response.status)}>{response.status} {response.statusText}</Badge>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" /> {response.latency}ms
        </span>
        {response.simulated && <Badge tone="violet">Simulated</Badge>}
      </div>
      <JsonViewer data={response.body} className="max-h-[360px]" />
    </motion.div>
  );
}
