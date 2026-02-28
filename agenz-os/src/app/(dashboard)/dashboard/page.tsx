"use client";

import { useState } from "react";
import { revenueChartData, primaryConstraint, mockLeads } from "@/lib/mock-data";
import { KPICard } from "@/components/dashboard/kpi-card";
import { BenchmarkStatus } from "@/components/dashboard/benchmark-status";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { PipelineFunnel } from "@/components/charts/pipeline-funnel";
import { GradientText } from "@/components/aceternity/background-gradient";
import { DateRangePicker, makeRange, type DateRange } from "@/components/ui/date-range-picker";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  UserPlus,
  TrendingUp,
  CheckCircle,
  Zap,
  Target,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { LEAD_STAGE_CONFIG } from "@/lib/constants";
import { currentKPIs } from "@/lib/mock-data";

// Revenue data with actual dates attached for filtering
const ALL_REVENUE = [
  { month: "Aug", revenue: 38000, baseline: 45000, profit: 10000, date: new Date(2025, 7,  1) },
  { month: "Sep", revenue: 41000, baseline: 45000, profit: 11000, date: new Date(2025, 8,  1) },
  { month: "Oct", revenue: 43500, baseline: 45000, profit: 12000, date: new Date(2025, 9,  1) },
  { month: "Nov", revenue: 45000, baseline: 45000, profit: 13500, date: new Date(2025, 10, 1) },
  { month: "Dec", revenue: 47500, baseline: 45000, profit: 14000, date: new Date(2025, 11, 1) },
  { month: "Jan", revenue: 49000, baseline: 45000, profit: 14500, date: new Date(2026, 0,  1) },
  { month: "Feb", revenue: 51000, baseline: 45000, profit: 15200, date: new Date(2026, 1,  1) },
];

const recentActivity = [
  { type: "lead",  icon: UserPlus,     color: "#3b82f6", message: "New lead: Ahmad Zulkifli (Solar Pro)",                   time: "2 min ago" },
  { type: "stage", icon: TrendingUp,   color: "#10b981", message: "Izzat Kamarudin moved to Negotiation",                  time: "1 hr ago"  },
  { type: "win",   icon: CheckCircle,  color: "#10b981", message: "Shuhaida Mohd — DEAL WON RM 32,000",                    time: "5 hr ago"  },
  { type: "alert", icon: AlertTriangle,color: "#ef4444", message: "Liyana's proposal stale 34 days — action needed",       time: "8 hr ago"  },
  { type: "lead",  icon: UserPlus,     color: "#3b82f6", message: "New lead: Rohani Said (Green Realty)",                  time: "1 day ago" },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>(() => makeRange("6M"));

  const criticalKPIs = currentKPIs.filter((k) => k.status === "critical");

  // Filter revenue chart to selected period
  const filteredRevenue = ALL_REVENUE.filter(
    d => d.date >= dateRange.from && d.date <= dateRange.to
  );

  // Period label for chart subtitle
  const fmtMo = (d: Date) => d.toLocaleDateString("en-MY", { month: "short", year: "2-digit" });
  const periodLabel = filteredRevenue.length
    ? `${fmtMo(filteredRevenue[0].date)} – ${fmtMo(filteredRevenue[filteredRevenue.length - 1].date)}`
    : "No data";

  // Derive quick stats from the filtered data
  const periodRevenue = filteredRevenue.reduce((s, d) => s + d.revenue, 0);
  const periodProfit  = filteredRevenue.reduce((s, d) => s + d.profit, 0);
  const lastMonthRev  = filteredRevenue[filteredRevenue.length - 1]?.revenue ?? 0;
  const prevMonthRev  = filteredRevenue[filteredRevenue.length - 2]?.revenue ?? lastMonthRev;
  const momGrowth     = prevMonthRev > 0
    ? (((lastMonthRev - prevMonthRev) / prevMonthRev) * 100).toFixed(1)
    : "0";

  // Filter leads active in period (last-active = today − daysInStage)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const periodLeads = mockLeads.filter(l => {
    const lastActive = new Date(now.getTime() - l.daysInStage * 86_400_000);
    return lastActive >= dateRange.from && lastActive <= dateRange.to;
  });
  const recentLeads = periodLeads.slice(0, 5);

  const quickStats = [
    {
      label: "Revenue",
      value: `RM ${(periodRevenue / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: "#3b82f6",
      sub: `${filteredRevenue.length} month${filteredRevenue.length !== 1 ? "s" : ""} · ${periodLabel}`,
    },
    {
      label: "Net Profit",
      value: `RM ${(periodProfit / 1000).toFixed(0)}K`,
      icon: Target,
      color: "#10b981",
      sub: `${periodRevenue > 0 ? ((periodProfit / periodRevenue) * 100).toFixed(0) : 0}% margin`,
    },
    {
      label: "Active Leads",
      value: periodLeads.filter(l => l.stage !== "LOST").length.toString(),
      icon: Users,
      color: "#06b6d4",
      sub: `${periodLeads.filter(l => l.stage === "WON").length} won in period`,
    },
    {
      label: "MoM Growth",
      value: `+${momGrowth}%`,
      icon: Zap,
      color: "#8b5cf6",
      sub: "vs previous month",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Page Title */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Good morning, <GradientText gradient="blue-cyan">Faizal</GradientText> 👋
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Solar Pro Malaysia · Beginner Plan ·{" "}
            <span className="text-orange-400 font-medium">
              {criticalKPIs.length} critical constraint{criticalKPIs.length !== 1 ? "s" : ""} detected
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Link
            href="/modules/ads"
            className="flex items-center gap-2 rounded-xl bg-[#3b82f6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2563eb] transition-colors shadow-[0_0_16px_rgba(59,130,246,0.3)]"
          >
            <Target className="h-3.5 w-3.5" />
            Fix CPL
          </Link>
          <Link
            href="/crm"
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Activity className="h-3.5 w-3.5" />
            View CRM
          </Link>
        </div>
      </div>

      {/* Primary Constraint Card */}
      <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-5 glow-red">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/15">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
                Primary Constraint · CPL Too High
              </span>
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
                RM 18,000/month loss
              </span>
            </div>
            <p className="text-sm text-red-100/80 leading-relaxed">
              {primaryConstraint.problemStatement}
            </p>
          </div>
          <Link
            href="/modules/ads"
            className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition-colors"
          >
            Fix Now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Stats Row — reactive to date range */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {filteredRevenue.length === 0 ? (
          <div className="col-span-4 rounded-2xl border border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
            No data in the selected period. Try a wider range.
          </div>
        ) : (
          quickStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3"
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-foreground leading-none">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                <p className="text-[10px] font-medium mt-0.5 truncate" style={{ color: stat.color }}>{stat.sub}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* KPI Cards */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          KPI Performance vs Baseline
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {currentKPIs.map((metric) => (
            <KPICard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      {/* Charts Row — revenue chart filtered by period */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <RevenueChart data={filteredRevenue} period={periodLabel} />
        <PipelineFunnel />
      </div>

      {/* Bottom Row: Benchmark + Activity + Recent Leads */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <BenchmarkStatus />

        <div className="space-y-4">
          {/* Recent Activity */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon className="h-3 w-3" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug truncate">{item.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Leads — filtered by period */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Latest Leads
                {periodLeads.length > 0 && (
                  <span className="ml-2 text-[10px] font-normal text-muted-foreground">
                    {periodLeads.length} in period
                  </span>
                )}
              </h3>
              <Link href="/crm" className="text-[11px] text-[#3b82f6] hover:text-[#06b6d4] transition-colors font-medium">
                View all →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">No leads in selected period</p>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((lead) => {
                  const stageConfig = LEAD_STAGE_CONFIG[lead.stage];
                  return (
                    <div key={lead.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-[10px] font-bold text-[#3b82f6]">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{lead.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{lead.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${stageConfig.bgColor}`}>
                          {stageConfig.label}
                        </span>
                        <span className="text-[10px] font-semibold text-foreground">
                          RM {(lead.dealValue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
