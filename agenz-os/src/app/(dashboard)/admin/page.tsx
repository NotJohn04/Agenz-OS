"use client";

import { mockClients, mockFinancials } from "@/lib/mock-data";
import { HEALTH_STATUS_CONFIG, PACKAGE_CONFIG } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import {
  Building2, Users, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, ArrowRight, BarChart3
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const packageDistribution = [
  { name: "Advanced", value: 1, color: "#8b5cf6" },
  { name: "Intermediate", value: 2, color: "#06b6d4" },
  { name: "Beginner", value: 2, color: "#3b82f6" },
  { name: "Free", value: 1, color: "#6b7280" },
];

const revenueByMonth = [
  { month: "Sep", mrr: 8500 },
  { month: "Oct", mrr: 11500 },
  { month: "Nov", mrr: 15000 },
  { month: "Dec", mrr: 15000 },
  { month: "Jan", mrr: 15000 },
  { month: "Feb", mrr: 15500 },
];

function AdminOverviewPage() {
  const totalMRR = mockFinancials.reduce((s, f) => s + f.mrr, 0);
  const totalClients = mockClients.filter(c => c.role === "PAID_CLIENT").length;
  const criticalClients = mockClients.filter(c => c.healthStatus === "CRITICAL").length;
  const totalPipeline = mockFinancials.reduce((s, f) => s + f.totalPaid, 0);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Agenz MY Internal · {mockClients.length} total accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/upgrade" className="flex items-center gap-2 rounded-xl bg-[#3b82f6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2563eb] transition-colors shadow-[0_0_16px_rgba(59,130,246,0.2)]">
            Upgrade Client <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Monthly Recurring", value: `RM ${(totalMRR / 1000).toFixed(1)}K`, sub: "MRR · Feb 2026", icon: DollarSign, color: "#10b981" },
          { label: "Active Clients", value: totalClients, sub: "paid accounts", icon: Users, color: "#3b82f6" },
          { label: "Critical Accounts", value: criticalClients, sub: "need intervention", icon: AlertTriangle, color: "#ef4444" },
          { label: "Total Collected", value: `RM ${(totalPipeline / 1000).toFixed(0)}K`, sub: "all time", icon: TrendingUp, color: "#8b5cf6" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              <p className="text-[10px]" style={{ color: stat.color }}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        {/* MRR Growth */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">MRR Growth</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueByMonth} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => v != null ? [`RM ${Number(v).toLocaleString()}`, "MRR"] : ["-", "MRR"]} contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Bar dataKey="mrr" radius={[6, 6, 0, 0]}>
                {revenueByMonth.map((_, i) => (
                  <Cell key={i} fill={i === revenueByMonth.length - 1 ? "#3b82f6" : "#3b82f620"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Package distribution */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Package Distribution</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={packageDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {packageDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [v ?? "-", "clients"]} contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {packageDistribution.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-semibold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Health Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Client Health Dashboard</h3>
          <Link href="/admin/clients" className="text-xs text-[#3b82f6] hover:text-[#06b6d4] font-medium transition-colors">
            View all clients →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {["Client", "Package", "Health Score", "Status", "Modules Active", "Next Action"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockClients.map(client => {
                const healthConf = HEALTH_STATUS_CONFIG[client.healthStatus];
                const pkgConf = PACKAGE_CONFIG[client.packageTier];
                return (
                  <tr key={client.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: `linear-gradient(135deg, #3b82f6, #8b5cf6)` }}>
                          {client.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{client.name}</p>
                          <p className="text-[10px] text-muted-foreground">{client.businessName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold" style={{ color: pkgConf.color }}>
                        {pkgConf.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold" style={{ color: healthConf.color }}>{client.healthScore}</span>
                          <span className="text-[10px] text-muted-foreground">/100</span>
                        </div>
                        <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${client.healthScore}%`, backgroundColor: healthConf.color }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", healthConf.bgClass)}>
                        {healthConf.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-foreground">{client.activeModules.length}</span>
                      <span className="text-[10px] text-muted-foreground"> module{client.activeModules.length !== 1 ? "s" : ""}</span>
                    </td>
                    <td className="px-4 py-3">
                      {client.healthStatus === "CRITICAL" ? (
                        <Link href="/admin/upgrade" className="flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors">
                          <AlertTriangle className="h-3 w-3" />
                          Intervene
                        </Link>
                      ) : client.healthStatus === "WARNING" ? (
                        <Link href="/admin/upgrade" className="flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                          <Clock className="h-3 w-3" />
                          Review
                        </Link>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          On Track
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewPage;
