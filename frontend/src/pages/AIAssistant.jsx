import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import api from "../lib/api";
import MessageBubble from "../components/widgets/assistant/MessageBubble";
import TypingIndicator from "../components/widgets/assistant/TypingIndicator";
import PromptChips from "../components/widgets/assistant/PromptChips";
import { SUGGESTED_PROMPTS, generateAssistantReply } from "../components/widgets/assistant/replyTemplates";

const INITIAL_MESSAGES = [
  {
    id: "m0",
    role: "assistant",
    content:
      "Hi! I'm the Nexora AI Assistant. Ask me about endpoint mappings, error codes, or how to wire up a workflow across your connected APIs.",
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, role: "user", content: trimmed }]);
    setInput("");
    setTyping(true);

    let reply;
    try {
      const { data } = await api.post("/assistant/chat", { message: trimmed });
      reply = data.reply ?? data.message;
    } catch {
      // Expected right now — simulate a "thinking" delay then a templated reply.
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
      reply = generateAssistantReply(trimmed);
    }

    setTyping(false);
    setMessages((prev) => [...prev, { id: `a_${Date.now()}`, role: "assistant", content: reply }]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="AI Assistant" subtitle="Your copilot for endpoint mappings, debugging, and workflow ideas." />

      <GlassCard className="flex h-[calc(100vh-220px)] min-h-[480px] flex-col p-4 sm:p-5">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={m.content} />
          ))}
          {typing && <TypingIndicator />}
        </div>

        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          <PromptChips prompts={SUGGESTED_PROMPTS} onSelect={(p) => setInput(p)} />
          <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
            <label htmlFor="assistant-input" className="sr-only">
              Message the AI Assistant
            </label>
            <input
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your APIs, workflows, or errors..."
              className="focus-ring flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-cyan-400/50"
            />
            <Button type="submit" icon={<Send className="h-4 w-4" />} disabled={!input.trim() || typing}>
              Send
            </Button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
