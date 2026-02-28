"use client";

import { useState } from "react";
import { mockFinancials } from "@/lib/mock-data";
import { PACKAGE_CONFIG } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, DollarSign, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRangePicker, makeRange, type DateRange } from "@/components/ui/date-range-picker";

const churnRiskConfig = {
  LOW:    { label: "Low",    className: "bg-emerald-500/10 text-emerald-400", color: "#10b981" },
  MEDIUM: { label: "Medium", className: "bg-orange-500/10 text-orange-400",  color: "#f97316" },
  HIGH:   { label: "High",   className: "bg-red-500/10 text-red-400",        color: "#ef4444" },
};

// Mock MRR history by month (for the trend chart)
const ALL_MRR_MONTHS = [
  { month: "Sep", mrr: 8500,  date: new Date(2025, 8,  1) },
  { month: "Oct", mrr: 11500, date: new Date(2025, 9,  1) },
  { month: "Nov", mrr: 15000, date: new Date(2025, 10, 1) },
  { month: "Dec", mrr: 15000, date: new Date(2025, 11, 1) },
  { month: "Jan", mrr: 15000, date: new Date(2026, 0,  1) },
  { month: "Feb", mrr: 15500, date: new Date(2026, 1,  1) },
];

export default function FinancialPage() {
  const [dateRange, setDateRange] = useState<DateRange>(() => makeRange("6M"));

  // Filter month data to selected range
  const mrrMonths = ALL_MRR_MONTHS.filter(
    d => d.date >= dateRange.from && d.date <= dateRange.to
  );

  // For the date range label, build a short period string
  const fmtShort = (d: Date) =>
    d.toLocaleDateString("en-MY", { month: "long", year: "numeric" });
  const periodLabel = `${fmtShort(dateRange.from)} – ${fmtShort(dateRange.to)}`;

  // Filter clients active within the period (joined before range end)
  const activeFinancials = mockFinancials.filter(f => {
    const joined = new Date(2025, 8 - (f.joinedMonths - 1), 1); // approximate join date
    return joined <= dateRange.to;
  });

  const totalMRR    = activeFinancials.reduce((s, f) => s + f.mrr, 0);
  const totalARR    = activeFinancials.reduce((s, f) => s + f.arr, 0);
  const avgLTV      = activeFinancials.length ? activeFinancials.reduce((s, f) => s + f.ltv, 0) / activeFinancials.length : 0;
  const avgPayback  = activeFinancials.length ? activeFinancials.reduce((s, f) => s + f.paybackMonths, 0) / activeFinancials.length : 0;
  const highChurnCount = activeFinancials.filter(f => f.churnRisk === "HIGH").length;

  // MRR collected in period (approximated as MRR × months in range)
  const monthsInRange = mrrMonths.length || 1;
  const periodRevenue = Math.round(totalMRR * monthsInRange * 0.9); // rough collected figure

  const mrrByPackage = [
    { name: "Advanced",     mrr: 5500, color: "#8b5cf6" },
    { name: "Intermediate", mrr: 6000, color: "#06b6d4" },
    { name: "Beginner",     mrr: 3000, color: "#3b82f6" },
  ];

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Financial Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Agency P&L · {activeFinancials.length} active clients</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Period banner */}
      <div className="rounded-xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 px-4 py-2.5 flex items-center gap-2">
        <span className="text-[11px] font-semibold text-[#3b82f6] uppercase tracking-wider">Tracking period</span>
        <span className="text-[11px] text-muted-foreground">{periodLabel}</span>
        <span className="ml-auto text-[11px] font-bold text-[#3b82f6]">
          RM {periodRevenue.toLocaleString()} collected (est.)
        </span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Monthly Recurring Revenue", value: `RM ${totalMRR.toLocaleString()}`,          sub: "MRR",                  icon: DollarSign,    color: "#10b981" },
          { label: "Annual Recurring Revenue",  value: `RM ${(totalARR / 1000).toFixed(0)}K`,      sub: "ARR",                  icon: TrendingUp,    color: "#3b82f6" },
          { label: "Avg Lifetime Value",        value: `RM ${(avgLTV / 1000).toFixed(1)}K`,         sub: "per client",           icon: Users,         color: "#8b5cf6" },
          { label: "Avg Payback",               value: `${avgPayback.toFixed(1)} mo`,               sub: "avg CAC recovery",     icon: CheckCircle2,  color: "#06b6d4" },
          { label: "High Churn Risk",           value: highChurnCount,                              sub: "clients need retention", icon: AlertTriangle, color: "#ef4444" },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{stat.sub}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
        {/* MRR trend over selected period */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">MRR Trend</h3>
            <span className="text-[11px] text-muted-foreground">{mrrMonths.length} months shown</span>
          </div>
          {mrrMonths.length === 0 ? (
            <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
              No data in selected period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mrrMonths} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(v) => v != null ? [`RM ${Number(v).toLocaleString()}`, "MRR"] : ["-", "MRR"]}
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                />
                <Bar dataKey="mrr" radius={[6, 6, 0, 0]}>
                  {mrrMonths.map((_, i) => (
                    <Cell key={i} fill={i === mrrMonths.length - 1 ? "#3b82f6" : "#3b82f620"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* MRR by package */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">MRR by Package</h3>
          <div className="space-y-3">
            {mrrByPackage.map((pkg) => (
              <div key={pkg.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{pkg.name}</span>
                  <span className="font-bold" style={{ color: pkg.color }}>RM {pkg.mrr.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(pkg.mrr / totalMRR) * 100}%`, backgroundColor: pkg.color }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{((pkg.mrr / totalMRR) * 100).toFixed(0)}% of MRR</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Client P&L Breakdown</h3>
          <span className="text-[11px] text-muted-foreground">{activeFinancials.length} clients in period</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {["Client", "Package", "MRR", "ARR", "Total Paid", "LTV", "CAC", "Payback", "Churn Risk"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeFinancials.map((f) => {
                const pkgConf   = PACKAGE_CONFIG[f.packageTier];
                const churnConf = churnRiskConfig[f.churnRisk];
                const isProfit  = f.ltv > f.cac * 3;
                return (
                  <tr key={f.clientId} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-foreground">{f.clientName}</p>
                      <p className="text-[10px] text-muted-foreground">{f.joinedMonths} months active</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold" style={{ color: pkgConf.color }}>{pkgConf.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-emerald-400">RM {f.mrr.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-foreground">RM {f.arr.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-[#3b82f6]">RM {f.totalPaid.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-bold", isProfit ? "text-emerald-400" : "text-orange-400")}>
                        RM {f.ltv.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground">RM {f.cac.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground">{f.paybackMonths} mo</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", churnConf.className)}>
                        {churnConf.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-muted/30">
                <td className="px-4 py-3 text-xs font-bold text-foreground">Total</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-xs font-bold text-emerald-400">RM {totalMRR.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs font-bold text-foreground">RM {(totalARR / 1000).toFixed(0)}K</td>
                <td className="px-4 py-3 text-xs font-bold text-[#3b82f6]">RM {activeFinancials.reduce((s, f) => s + f.totalPaid, 0).toLocaleString()}</td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
