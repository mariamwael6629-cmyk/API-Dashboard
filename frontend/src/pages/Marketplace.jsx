import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import Input from "../components/ui/Input";
import EmptyState from "../components/ui/EmptyState";
import ProviderCard from "../components/widgets/marketplace/ProviderCard";
import ConnectionModal from "../components/widgets/marketplace/ConnectionModal";
import RequestLogsPanel from "../components/widgets/marketplace/RequestLogsPanel";
import { PROVIDERS } from "../lib/mockData";

const CATEGORIES = ["All", ...new Set(PROVIDERS.map((p) => p.category))];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeProvider, setActiveProvider] = useState(null);

  const filtered = useMemo(() => {
    return PROVIDERS.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div>
      <Topbar title="Marketplace" subtitle="Connect and manage every API integration" />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`focus-ring cursor-pointer rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? "glass-strong glow-cyan text-slate-100"
                  : "glass text-slate-400 hover:text-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            type="search"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search providers"
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No providers found"
          description="Try a different search term or category filter."
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} onConfigure={setActiveProvider} />
          ))}
        </div>
      )}

      <RequestLogsPanel />

      {activeProvider && (
        <ConnectionModal provider={activeProvider} onClose={() => setActiveProvider(null)} />
      )}
    </div>
  );
}
