import { currentKPIs, primaryConstraint, mockLeads } from "@/lib/mock-data";
import { KPICard } from "@/components/dashboard/kpi-card";
import { BenchmarkStatus } from "@/components/dashboard/benchmark-status";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { PipelineFunnel } from "@/components/charts/pipeline-funnel";
import { GradientText } from "@/components/aceternity/background-gradient";
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

const recentActivity = [
  { type: "lead", icon: UserPlus, color: "#3b82f6", message: "New lead: Ahmad Zulkifli (Solar Pro)", time: "2 min ago" },
  { type: "stage", icon: TrendingUp, color: "#10b981", message: "Izzat Kamarudin moved to Negotiation", time: "1 hr ago" },
  { type: "win", icon: CheckCircle, color: "#10b981", message: "Shuhaida Mohd — DEAL WON RM 32,000", time: "5 hr ago" },
  { type: "alert", icon: AlertTriangle, color: "#ef4444", message: "Liyana's proposal stale 34 days — action needed", time: "8 hr ago" },
  { type: "lead", icon: UserPlus, color: "#3b82f6", message: "New lead: Rohani Said (Green Realty)", time: "1 day ago" },
];

const quickStats = [
  { label: "Active Leads", value: "45", icon: Users, color: "#3b82f6", sub: "+5 this week" },
  { label: "Win This Month", value: "RM 58K", icon: TrendingUp, color: "#10b981", sub: "2 deals closed" },
  { label: "Avg Deal Size", value: "RM 29K", icon: Target, color: "#06b6d4", sub: "vs RM 24K last mo." },
  { label: "Response Time", value: "< 2 min", icon: Zap, color: "#8b5cf6", sub: "AI Chatbot active" },
];

export default function DashboardPage() {
  const criticalKPIs = currentKPIs.filter((k) => k.status === "critical");
  const recentLeads = mockLeads.slice(0, 5);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Page Title */}
      <div className="flex items-start justify-between">
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
        <div className="flex items-center gap-2">
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

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickStats.map((stat) => (
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
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: stat.color }}>{stat.sub}</p>
            </div>
          </div>
        ))}
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <RevenueChart />
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

          {/* Recent Leads */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Latest Leads</h3>
              <Link href="/crm" className="text-[11px] text-[#3b82f6] hover:text-[#06b6d4] transition-colors font-medium">
                View all →
              </Link>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
