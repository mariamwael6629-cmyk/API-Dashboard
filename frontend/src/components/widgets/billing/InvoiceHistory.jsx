import { Download } from "lucide-react";
import GlassCard from "../../ui/GlassCard";
import Badge from "../../ui/Badge";

const TONE = { Paid: "lime", Pending: "amber", Failed: "rose" };

export default function InvoiceHistory({ invoices }) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Invoice history</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-2.5 font-medium">Date</th>
              <th className="pb-2.5 font-medium">Amount</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="text-slate-300">
                <td className="py-3">{inv.date}</td>
                <td className="py-3 font-mono">${inv.amount.toFixed(2)}</td>
                <td className="py-3">
                  <Badge tone={TONE[inv.status] ?? "slate"}>{inv.status}</Badge>
                </td>
                <td className="py-3 text-right">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-cyan-300 hover:text-cyan-200"
                    aria-label={`Download invoice from ${inv.date}`}
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
