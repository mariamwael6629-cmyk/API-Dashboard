import { useEffect, useRef, useState } from "react";

/**
 * Subscribes to the backend's live monitoring websocket. If the backend
 * isn't reachable (e.g. running the UI standalone), falls back to a local
 * simulated tick so every real-time widget still animates with demo data.
 */
export function useLiveFeed(path = "/ws/monitoring", { simulate } = {}) {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const simRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    function startSimulation() {
      if (!simulate || simRef.current) return;
      simRef.current = setInterval(() => {
        if (!cancelled) setData(simulate());
      }, 2000);
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const ws = new WebSocket(`${protocol}://${window.location.host}${path}`);
      wsRef.current = ws;

      ws.onopen = () => !cancelled && setConnected(true);
      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          setData(JSON.parse(event.data));
        } catch {
          setData(event.data);
        }
      };
      ws.onerror = () => startSimulation();
      ws.onclose = () => {
        if (!cancelled) setConnected(false);
        startSimulation();
      };
    } catch {
      startSimulation();
    }

    return () => {
      cancelled = true;
      wsRef.current?.close();
      if (simRef.current) clearInterval(simRef.current);
    };
  }, [path]);

  return { data, connected };
}
