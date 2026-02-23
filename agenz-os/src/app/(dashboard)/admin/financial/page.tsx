"use client";

import { mockFinancials } from "@/lib/mock-data";
import { PACKAGE_CONFIG } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, DollarSign, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const churnRiskConfig = {
  LOW: { label: "Low", className: "bg-emerald-500/10 text-emerald-400", color: "#10b981" },
  MEDIUM: { label: "Medium", className: "bg-orange-500/10 text-orange-400", color: "#f97316" },
  HIGH: { label: "High", className: "bg-red-500/10 text-red-400", color: "#ef4444" },
};

export default function FinancialPage() {
  const totalMRR = mockFinancials.reduce((s, f) => s + f.mrr, 0);
  const totalARR = mockFinancials.reduce((s, f) => s + f.arr, 0);
  const avgLTV = mockFinancials.reduce((s, f) => s + f.ltv, 0) / mockFinancials.length;
  const avgPayback = mockFinancials.reduce((s, f) => s + f.paybackMonths, 0) / mockFinancials.length;
  const highChurnCount = mockFinancials.filter(f => f.churnRisk === "HIGH").length;

  const mrrByPackage = [
    { name: "Advanced", mrr: 5500, color: "#8b5cf6" },
    { name: "Intermediate", mrr: 6000, color: "#06b6d4" },
    { name: "Beginner", mrr: 3000, color: "#3b82f6" },
  ];

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Financial Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Agency P&L · All active clients · February 2026</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Monthly Recurring Revenue", value: `RM ${totalMRR.toLocaleString()}`, sub: "MRR", icon: DollarSign, color: "#10b981" },
          { label: "Annual Recurring Revenue", value: `RM ${(totalARR / 1000).toFixed(0)}K`, sub: "ARR", icon: TrendingUp, color: "#3b82f6" },
          { label: "Avg Lifetime Value", value: `RM ${(avgLTV / 1000).toFixed(1)}K`, sub: "per client", icon: Users, color: "#8b5cf6" },
          { label: "Avg Payback", value: `${avgPayback.toFixed(1)} mo`, sub: "avg CAC recovery", icon: CheckCircle2, color: "#06b6d4" },
          { label: "High Churn Risk", value: highChurnCount, sub: "clients need retention", icon: AlertTriangle, color: "#ef4444" },
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
        {/* MRR by client bar */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">MRR by Client</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockFinancials} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="clientName" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => v.split(" ")[0]} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => v != null ? [`RM ${Number(v).toLocaleString()}`, "MRR"] : ["-", "MRR"]} contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Bar dataKey="mrr" radius={[6, 6, 0, 0]}>
                {mockFinancials.map((f, i) => (
                  <Cell key={i} fill={PACKAGE_CONFIG[f.packageTier].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Client P&L Breakdown</h3>
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
              {mockFinancials.map((f) => {
                const pkgConf = PACKAGE_CONFIG[f.packageTier];
                const churnConf = churnRiskConfig[f.churnRisk];
                const isProfit = f.ltv > f.cac * 3;
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
                <td className="px-4 py-3 text-xs font-bold text-[#3b82f6]">RM {mockFinancials.reduce((s, f) => s + f.totalPaid, 0).toLocaleString()}</td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
