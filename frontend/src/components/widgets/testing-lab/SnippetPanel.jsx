import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { buildCurl, buildFetch, buildPython } from "./snippets";

const TABS = [
  { id: "curl", label: "cURL", build: buildCurl },
  { id: "js", label: "JavaScript", build: buildFetch },
  { id: "python", label: "Python", build: buildPython },
];

export default function SnippetPanel({ request }) {
  const [tab, setTab] = useState("curl");
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    const builder = TABS.find((t) => t.id === tab)?.build ?? buildCurl;
    return builder(request);
  }, [tab, request]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — no-op
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div role="tablist" aria-label="Snippet language" className="flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`focus-ring rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                tab === t.id ? "bg-white/10 text-slate-100" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy snippet"
          className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-100 cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-lime-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-[300px] overflow-auto rounded-xl bg-black/30 p-4 font-mono text-xs leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}
