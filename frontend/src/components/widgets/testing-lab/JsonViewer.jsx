// Lightweight hand-rolled JSON syntax highlighter — no external dep needed.
// Tokenizes a pretty-printed JSON string and wraps tokens in colored spans.
function tokenize(jsonString) {
  const pattern =
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(jsonString)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: jsonString.slice(lastIndex, match.index), cls: "" });
    }
    const token = match[0];
    let cls = "text-amber-300"; // number
    if (/^"/.test(token)) {
      cls = /:\s*$/.test(token) ? "text-cyan-300" : "text-lime-300"; // key vs string value
    } else if (/true|false/.test(token)) {
      cls = "text-violet-300";
    } else if (/null/.test(token)) {
      cls = "text-rose-300";
    }
    parts.push({ text: token, cls });
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < jsonString.length) {
    parts.push({ text: jsonString.slice(lastIndex), cls: "" });
  }
  return parts;
}

export default function JsonViewer({ data, className }) {
  let pretty;
  try {
    pretty = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  } catch {
    pretty = String(data);
  }
  const parts = tokenize(pretty);

  return (
    <pre className={`overflow-auto rounded-xl bg-black/30 p-4 font-mono text-xs leading-relaxed ${className ?? ""}`}>
      <code className="text-slate-300">
        {parts.map((p, i) => (
          <span key={i} className={p.cls}>
            {p.text}
          </span>
        ))}
      </code>
    </pre>
  );
}
