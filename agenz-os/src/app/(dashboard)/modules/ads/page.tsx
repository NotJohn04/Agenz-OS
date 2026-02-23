"use client";

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, ReferenceLine
} from "recharts";
import { mockCampaigns, leadVolumeData } from "@/lib/mock-data";
import { primaryConstraint } from "@/lib/mock-data";
import {
  AlertTriangle, Target, TrendingDown, TrendingUp, Zap,
  ExternalLink, Pause, Play, ArrowRight, CheckCircle2, XCircle, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const industryBenchmark = { min: 10, max: 20, label: "RM 10–20" };
const currentCPL = 34;
const cplGaugePercent = Math.min((currentCPL / (industryBenchmark.max * 2.5)) * 100, 100);

const budgetData = [
  { name: "Facebook Ads", value: 3420, color: "#3b82f6" },
  { name: "Google Ads", value: 2100, color: "#06b6d4" },
  { name: "TikTok Ads", value: 1500, color: "#8b5cf6" },
  { name: "WhatsApp", value: 120, color: "#10b981" },
];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#111] p-3 text-xs shadow-2xl">
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((e) => (
          <div key={e.name} className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} />
            <span className="text-gray-400">{e.name}:</span>
            <span className="font-semibold text-white">{e.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function CPLGauge() {
  const isAboveBenchmark = currentCPL > industryBenchmark.max;
  const isFarAbove = currentCPL > industryBenchmark.max * 1.5;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">CPL vs Industry Benchmark</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Solar Energy · Malaysia</p>
        </div>
        {isFarAbove ? (
          <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Critical
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-2.5 py-1.5 text-xs font-bold text-orange-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Warning
          </div>
        )}
      </div>

      {/* Visual gauge */}
      <div className="relative mb-4">
        <div className="h-6 w-full rounded-full bg-muted overflow-hidden">
          {/* Benchmark range */}
          <div
            className="absolute h-full rounded-r-none bg-emerald-500/20 border-r border-emerald-500"
            style={{
              left: `${(industryBenchmark.min / (industryBenchmark.max * 2.5)) * 100}%`,
              width: `${((industryBenchmark.max - industryBenchmark.min) / (industryBenchmark.max * 2.5)) * 100}%`,
            }}
          />
          {/* Your value */}
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${cplGaugePercent}%`,
              background: isFarAbove
                ? "linear-gradient(90deg, #10b981, #f59e0b, #ef4444)"
                : "linear-gradient(90deg, #10b981, #f97316)",
            }}
          />
          {/* Marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ left: `${cplGaugePercent}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>RM 0</span>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-3 rounded bg-emerald-500/40" />
            <span>Benchmark: {industryBenchmark.label}</span>
          </div>
          <span>RM 50</span>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-muted/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Your CPL</p>
          <p className="text-xl font-bold text-red-400">RM {currentCPL}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Industry Benchmark</p>
          <p className="text-xl font-bold text-emerald-400">{industryBenchmark.label}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground">Above Market</p>
          <p className="text-xl font-bold text-red-400">+{((currentCPL / industryBenchmark.max - 1) * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-4 rounded-xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-3.5">
        <div className="flex items-start gap-2">
          <Zap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#8b5cf6]" />
          <div>
            <p className="text-[11px] font-semibold text-[#8b5cf6] mb-1">AI Constraint Analysis</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your Facebook Campaign &ldquo;Solar - Klang Valley Q1&rdquo; is your highest-spend, lowest-performing campaign at RM 122/lead — <strong className="text-white">6.1x above benchmark</strong>. Pausing this campaign and reallocating RM 3,420 to your Referral Program (RM 30/lead) could reduce blended CPL to RM 18.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdsPerformancePage() {
  const totalSpent = mockCampaigns.reduce((s, c) => s + c.spent, 0);
  const totalLeads = mockCampaigns.reduce((s, c) => s + c.leads, 0);
  const blendedCPL = totalLeads > 0 ? (totalSpent / totalLeads).toFixed(0) : 0;
  const totalBudget = mockCampaigns.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3b82f6]/10">
              <Target className="h-4 w-4 text-[#3b82f6]" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Ads Performance</h1>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">ACTIVE MODULE</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Solar Pro Malaysia · Beginner Package</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-2 h-9">
            <ExternalLink className="h-3.5 w-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Constraint Warning */}
      <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-400 mb-0.5">Primary Constraint: CPL Too High</p>
          <p className="text-xs text-red-300/70 leading-relaxed">{primaryConstraint.problemStatement}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-red-400/60">Est. loss</p>
          <p className="text-lg font-bold text-red-400">RM 18K<span className="text-xs font-normal">/mo</span></p>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Total Spent", value: `RM ${(totalSpent / 1000).toFixed(1)}K`, sub: `of RM ${(totalBudget / 1000).toFixed(1)}K budget`, color: "#3b82f6", trend: null },
          { label: "Total Leads", value: totalLeads, sub: "this month", color: "#06b6d4", trend: "+12%" },
          { label: "Blended CPL", value: `RM ${blendedCPL}`, sub: "Target: RM 10–20", color: "#ef4444", trend: "+54%" },
          { label: "Best CPL", value: "RM 30", sub: "WhatsApp Referral", color: "#10b981", trend: null },
          { label: "Active Campaigns", value: mockCampaigns.filter(c => c.status === "ACTIVE").length, sub: "of " + mockCampaigns.length + " total", color: "#8b5cf6", trend: null },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <div className="mt-1 flex items-center gap-1.5">
              {stat.trend && (
                <span className={cn("text-[10px] font-semibold", stat.trend.startsWith("+") ? "text-red-400" : "text-emerald-400")}>
                  {stat.trend}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        {/* Left: Lead Volume Chart */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Lead Volume (30 Days)</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daily leads vs target · all campaigns</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5"><div className="h-2 w-4 rounded-sm bg-[#3b82f6]" /><span className="text-muted-foreground">Leads</span></span>
              <span className="flex items-center gap-1.5"><div className="h-px w-4 border-t-2 border-dashed border-muted-foreground/50" /><span className="text-muted-foreground">Target</span></span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={leadVolumeData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#9ca3af" }} interval={4} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={2} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.7} />
              <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} fill="url(#leadGrad)" dot={false} name="Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right: CPL Gauge */}
        <CPLGauge />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
        {/* Campaign Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Campaign Performance</h3>
            <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" />New Campaign
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  {["Campaign", "Platform", "Status", "Spent / Budget", "Leads", "CPL", "ROAS"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockCampaigns.map((campaign) => {
                  const isBadCPL = campaign.cpl > industryBenchmark.max;
                  const isVeryBadCPL = campaign.cpl > industryBenchmark.max * 3;
                  const spentPct = Math.round((campaign.spent / campaign.budget) * 100);
                  return (
                    <tr key={campaign.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">{campaign.name}</p>
                        <p className="text-[10px] text-muted-foreground">CTR: {campaign.ctr}%</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{campaign.platform}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className={cn("h-1.5 w-1.5 rounded-full",
                            campaign.status === "ACTIVE" ? "bg-emerald-400" :
                            campaign.status === "PAUSED" ? "bg-orange-400" : "bg-muted-foreground"
                          )} />
                          <span className={cn("text-[10px] font-medium",
                            campaign.status === "ACTIVE" ? "text-emerald-400" :
                            campaign.status === "PAUSED" ? "text-orange-400" : "text-muted-foreground"
                          )}>
                            {campaign.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-medium text-foreground">RM {campaign.spent.toLocaleString()}</p>
                          <div className="mt-1 h-1 w-16 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${spentPct}%` }} />
                          </div>
                          <p className="text-[9px] text-muted-foreground">{spentPct}% of RM {campaign.budget.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-foreground">{campaign.leads}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {isVeryBadCPL ? <XCircle className="h-3.5 w-3.5 text-red-400" /> :
                           isBadCPL ? <AlertTriangle className="h-3.5 w-3.5 text-orange-400" /> :
                           <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                          <span className={cn("text-xs font-bold",
                            isVeryBadCPL ? "text-red-400" :
                            isBadCPL ? "text-orange-400" : "text-emerald-400"
                          )}>
                            RM {campaign.cpl}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-bold",
                          campaign.roas >= 3 ? "text-emerald-400" : campaign.roas >= 2 ? "text-orange-400" : "text-red-400"
                        )}>
                          {campaign.roas}x
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Allocation Donut */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={budgetData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => v != null ? [`RM ${Number(v).toLocaleString()}`, "Spent"] : ["-", "Spent"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {budgetData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-semibold text-foreground">RM {d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#3b82f6]" />
          Recommended Actions — Ranked by Impact
        </h3>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {[
            {
              priority: 1,
              title: "Pause Facebook KV Campaign",
              impact: "Saves RM 3,420/mo · drops blended CPL to ~RM 18",
              color: "#ef4444",
              severity: "Critical",
            },
            {
              priority: 2,
              title: "Scale WhatsApp Referral to RM 2,000",
              impact: "Best performing at RM 30 CPL — 4.2x ROAS",
              color: "#10b981",
              severity: "High Impact",
            },
            {
              priority: 3,
              title: "A/B test 3 new Facebook creatives",
              impact: "Industry avg CTR is 2.8% — yours is 2.0%",
              color: "#f59e0b",
              severity: "Moderate",
            },
          ].map((action) => (
            <div
              key={action.priority}
              className="rounded-xl border border-border bg-card p-4 hover:border-[#3b82f6]/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: `${action.color}20`, color: action.color }}>
                  {action.priority}
                </div>
                <span className="text-[10px] font-semibold rounded-full px-2 py-0.5" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                  {action.severity}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground mb-1">{action.title}</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{action.impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
