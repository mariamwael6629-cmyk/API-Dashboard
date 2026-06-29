import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GlassCard from "../../ui/GlassCard";
import Button from "../../ui/Button";

export default function AiSuggestionWidget() {
  return (
    <GlassCard glow="violet" strong className="col-span-4 p-5 sm:col-span-2 lg:col-span-1">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-300" />
        <h3 className="font-display text-sm font-semibold text-slate-100">AI Suggestion</h3>
      </div>

      <p className="mt-3 text-sm text-slate-300">
        Discord's error rate jumped to <span className="text-amber-300">4.6%</span> in the last
        hour. Consider adding retry-with-backoff or temporarily throttling non-critical calls.
      </p>

      <Link to="/app/assistant">
        <Button variant="secondary" size="sm" className="mt-4 w-full" icon={<ArrowRight className="h-3.5 w-3.5" />}>
          Ask the AI Assistant
        </Button>
      </Link>
    </GlassCard>
  );
}
