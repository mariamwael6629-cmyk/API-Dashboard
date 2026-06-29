import { useState } from "react";
import clsx from "clsx";
import { Plus, Trash2, Send, Loader2 } from "lucide-react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const METHOD_COLORS = {
  GET: "text-cyan-300 border-cyan-400/30 bg-cyan-400/5",
  POST: "text-lime-300 border-lime-400/30 bg-lime-400/5",
  PUT: "text-amber-300 border-amber-400/30 bg-amber-400/5",
  PATCH: "text-violet-300 border-violet-400/30 bg-violet-400/5",
  DELETE: "text-rose-300 border-rose-400/30 bg-rose-400/5",
};
const TABS = ["Headers", "Body", "Auth"];

export default function RequestBuilder({
  method,
  setMethod,
  url,
  setUrl,
  headers,
  setHeaders,
  body,
  setBody,
  authToken,
  setAuthToken,
  onSend,
  sending,
}) {
  const [tab, setTab] = useState("Headers");

  const updateHeader = (idx, field, value) => {
    setHeaders((prev) => prev.map((h, i) => (i === idx ? { ...h, [field]: value } : h)));
  };
  const addHeader = () => setHeaders((prev) => [...prev, { key: "", value: "" }]);
  const removeHeader = (idx) => setHeaders((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label className="sr-only" htmlFor="http-method">
          HTTP method
        </label>
        <select
          id="http-method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={clsx(
            "focus-ring rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors sm:w-32",
            "bg-white/[0.03]",
            METHOD_COLORS[method]
          )}
        >
          {METHODS.map((m) => (
            <option key={m} value={m} className="bg-void-900 text-slate-100">
              {m}
            </option>
          ))}
        </select>
        <Input
          aria-label="Request URL"
          placeholder="https://api.example.com/v1/resource"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={onSend}
          disabled={sending}
          icon={sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          className="sm:w-32"
        >
          {sending ? "Sending" : "Send"}
        </Button>
      </div>

      <div role="tablist" aria-label="Request configuration" className="flex gap-1.5 border-b border-white/10 pb-0">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              "focus-ring -mb-px rounded-t-lg px-3.5 py-2 text-sm transition-colors cursor-pointer",
              tab === t
                ? "border-b-2 border-cyan-400 text-slate-100"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="min-h-[180px]">
        {tab === "Headers" && (
          <div className="space-y-2.5">
            {headers.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  aria-label={`Header ${idx + 1} key`}
                  placeholder="Header-Name"
                  value={h.key}
                  onChange={(e) => updateHeader(idx, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  aria-label={`Header ${idx + 1} value`}
                  placeholder="value"
                  value={h.value}
                  onChange={(e) => updateHeader(idx, "value", e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  aria-label={`Remove header ${idx + 1}`}
                  onClick={() => removeHeader(idx)}
                  className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:text-rose-300 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="ghost" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={addHeader}>
              Add header
            </Button>
          </div>
        )}

        {tab === "Body" && (
          <div className="space-y-1.5">
            <label htmlFor="req-body" className="text-xs font-medium text-slate-400">
              JSON body
            </label>
            <textarea
              id="req-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder={'{\n  "key": "value"\n}'}
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/[0.03] p-3.5 font-mono text-xs text-slate-100 placeholder:text-slate-500 transition-colors focus:border-cyan-400/50"
            />
          </div>
        )}

        {tab === "Auth" && (
          <div className="space-y-3">
            <Input
              label="Bearer token"
              placeholder="sk-••••••••••••"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Sent as <code className="font-mono text-slate-400">Authorization: Bearer &lt;token&gt;</code> when present.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
