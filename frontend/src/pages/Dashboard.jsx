import { useEffect, useState } from "react";
import { AlertTriangle, Gauge } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import { SkeletonCard } from "../components/ui/Skeleton";
import LiveTrafficWidget from "../components/widgets/dashboard/LiveTrafficWidget";
import ConnectedApisWidget from "../components/widgets/dashboard/ConnectedApisWidget";
import UptimeWidget from "../components/widgets/dashboard/UptimeWidget";
import ActivityFeedWidget from "../components/widgets/dashboard/ActivityFeedWidget";
import AiSuggestionWidget from "../components/widgets/dashboard/AiSuggestionWidget";
import StatWidget from "../components/widgets/dashboard/StatWidget";
import { PROVIDERS } from "../lib/mockData";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const avgErrorRate = (
    PROVIDERS.reduce((acc, p) => acc + p.errorRate, 0) / PROVIDERS.length
  ).toFixed(2);
  const avgLatency = Math.round(
    PROVIDERS.filter((p) => p.avgLatency > 0).reduce((acc, p) => acc + p.avgLatency, 0) /
      PROVIDERS.filter((p) => p.avgLatency > 0).length
  );

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Real-time overview of your API ecosystem" />

      {loading ? (
        <div className="mt-6 grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={i < 2 ? "col-span-2 row-span-2" : "col-span-2 sm:col-span-1"}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-4 gap-4">
          <LiveTrafficWidget />
          <ConnectedApisWidget />
          <UptimeWidget />
          <AiSuggestionWidget />
          <ActivityFeedWidget />
          <StatWidget
            icon={AlertTriangle}
            label="Avg Error Rate"
            value={avgErrorRate}
            suffix="%"
            trend="-0.3%"
            tone="amber"
          />
          <StatWidget
            icon={Gauge}
            label="Avg Latency"
            value={avgLatency}
            suffix="ms"
            trend="+12ms"
            tone="cyan"
          />
        </div>
      )}
    </div>
  );
}
