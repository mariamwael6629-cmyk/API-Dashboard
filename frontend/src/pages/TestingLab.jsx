import { useCallback, useState } from "react";
import Topbar from "../components/layout/Topbar";
import GlassCard from "../components/ui/GlassCard";
import api from "../lib/api";
import RequestBuilder from "../components/widgets/testing-lab/RequestBuilder";
import ResponsePanel from "../components/widgets/testing-lab/ResponsePanel";
import SnippetPanel from "../components/widgets/testing-lab/SnippetPanel";
import RequestHistory from "../components/widgets/testing-lab/RequestHistory";

const STATUS_TEXT = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error",
};

function buildMockResponse({ method, url }) {
  const status = 200;
  return {
    id: `resp_${Date.now()}`,
    status,
    statusText: STATUS_TEXT[status],
    latency: Math.round(80 + Math.random() * 420),
    simulated: true,
    body: {
      success: true,
      method,
      url: url || "https://api.example.com/v1/resource",
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
      timestamp: new Date().toISOString(),
      data: {
        id: Math.floor(Math.random() * 100000),
        message: "This is a simulated response — backend not connected yet.",
        items: [
          { id: 1, name: "Sample Item A", active: true },
          { id: 2, name: "Sample Item B", active: false },
        ],
      },
    },
  };
}

export default function TestingLab() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.nexora.dev/v1/providers/openai/usage");
  const [headers, setHeaders] = useState([{ key: "Content-Type", value: "application/json" }]);
  const [body, setBody] = useState('{\n  "limit": 10\n}');
  const [authToken, setAuthToken] = useState("");
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSend = useCallback(async () => {
    setSending(true);
    const headerMap = headers
      .filter((h) => h.key.trim())
      .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
    if (authToken) headerMap.Authorization = `Bearer ${authToken}`;

    let result;
    try {
      const { data } = await api.post("/testing/run", {
        method,
        url,
        headers: headerMap,
        body,
      });
      result = {
        id: `resp_${Date.now()}`,
        status: data.status ?? 200,
        statusText: STATUS_TEXT[data.status] ?? "OK",
        latency: data.latency ?? 0,
        simulated: false,
        body: data.body ?? data,
      };
    } catch {
      // Expected right now — backend isn't wired up. Simulate a believable response.
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
      result = buildMockResponse({ method, url });
    }

    setResponse(result);
    setHistory((prev) => [
      { id: result.id, method, url, status: result.status, timestamp: Date.now() },
      ...prev,
    ].slice(0, 25));
    setSending(false);
  }, [method, url, headers, authToken, body]);

  const handleSelectHistory = useCallback((entry) => {
    setMethod(entry.method);
    setUrl(entry.url);
  }, []);

  return (
    <div className="space-y-6">
      <Topbar
        title="API Testing Lab"
        subtitle="Build, send, and inspect requests against any connected provider."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <GlassCard className="min-w-0 overflow-x-auto p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Request Builder</h2>
          <RequestBuilder
            method={method}
            setMethod={setMethod}
            url={url}
            setUrl={setUrl}
            headers={headers}
            setHeaders={setHeaders}
            body={body}
            setBody={setBody}
            authToken={authToken}
            setAuthToken={setAuthToken}
            onSend={handleSend}
            sending={sending}
          />
        </GlassCard>

        <GlassCard className="min-w-0 p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Response</h2>
          <ResponsePanel response={response} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <GlassCard className="min-w-0 p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Code Snippet</h2>
          <SnippetPanel request={{ method, url, headers, body }} />
        </GlassCard>

        <GlassCard className="min-w-0 p-5">
          <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Request History</h2>
          <RequestHistory history={history} onSelect={handleSelectHistory} activeId={response?.id} />
        </GlassCard>
      </div>
    </div>
  );
}
