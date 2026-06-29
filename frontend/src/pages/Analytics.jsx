import Topbar from "../components/layout/Topbar";
import TrafficOverviewChart from "../components/widgets/analytics/TrafficOverviewChart";
import LatencyHeatmap from "../components/widgets/analytics/LatencyHeatmap";
import SuccessRateDonut from "../components/widgets/analytics/SuccessRateDonut";
import ProviderBreakdownTable from "../components/widgets/analytics/ProviderBreakdownTable";

export default function Analytics() {
  return (
    <div>
      <Topbar title="Analytics Center" subtitle="Deep observability across your API stack" />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficOverviewChart />
        </div>
        <SuccessRateDonut />
      </div>

      <div className="mt-4">
        <LatencyHeatmap />
      </div>

      <div className="mt-4">
        <ProviderBreakdownTable />
      </div>
    </div>
  );
}
