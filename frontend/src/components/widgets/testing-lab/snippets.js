// Generates request snippets (cURL / JS fetch / Python requests) from the
// current request builder state, so the "code export" panel stays in sync.

function parseHeaders(headerRows) {
  return headerRows.filter((h) => h.key.trim()).map((h) => [h.key.trim(), h.value]);
}

export function buildCurl({ method, url, headers, body }) {
  const lines = [`curl -X ${method} "${url || "https://api.example.com/v1/resource"}"`];
  parseHeaders(headers).forEach(([k, v]) => lines.push(`  -H "${k}: ${v}"`));
  if (body && method !== "GET") {
    lines.push(`  -d '${body.replace(/'/g, "'\\''")}'`);
  }
  return lines.join(" \\\n");
}

export function buildFetch({ method, url, headers, body }) {
  const headerObj = parseHeaders(headers);
  const headersStr = headerObj.length
    ? `{\n${headerObj.map(([k, v]) => `    "${k}": "${v}"`).join(",\n")}\n  }`
    : "{}";
  const hasBody = body && method !== "GET";
  return `fetch("${url || "https://api.example.com/v1/resource"}", {
  method: "${method}",
  headers: ${headersStr},${hasBody ? `\n  body: JSON.stringify(${safeBody(body)}),` : ""}
})
  .then((res) => res.json())
  .then((data) => console.log(data));`;
}

export function buildPython({ method, url, headers, body }) {
  const headerObj = parseHeaders(headers);
  const headersStr = headerObj.length
    ? `{\n${headerObj.map(([k, v]) => `    "${k}": "${v}"`).join(",\n")}\n}`
    : "{}";
  const hasBody = body && method !== "GET";
  return `import requests

response = requests.request(
    "${method}",
    "${url || "https://api.example.com/v1/resource"}",
    headers=${headersStr},${hasBody ? `\n    json=${safeBody(body)},` : ""}
)

print(response.status_code)
print(response.json())`;
}

function safeBody(body) {
  try {
    return JSON.stringify(JSON.parse(body), null, 2).replace(/\n/g, "\n  ");
  } catch {
    return JSON.stringify(body);
  }
}
