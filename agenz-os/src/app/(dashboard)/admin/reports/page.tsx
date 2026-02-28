"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  Globe,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { mockClients, revenueChartData, mockLeads, mockCampaigns, currentKPIs } from "@/lib/mock-data";
import { PACKAGE_CONFIG } from "@/lib/constants";
import Image from "next/image";

// ─── Report data generator ──────────────────────────────────────────────────────
function getReportData(clientId: string) {
  const client = mockClients.find((c) => c.id === clientId)!;
  const tier = client.packageTier;
  const health = client.healthScore ?? 50;
  const pkg = PACKAGE_CONFIG[tier];

  // Scale metrics by health + tier
  const baseRevenue = pkg?.price ?? 1500;
  const multiplier = health / 100;
  const leads = Math.round(20 + health * 1.2);
  const cpl = Math.round(34 - health * 0.18);
  const closeRate = Math.round(10 + health * 0.28);
  const roas = parseFloat((1.5 + health * 0.025).toFixed(1));
  const adSpend = Math.round(baseRevenue * 0.4);
  const revenue = Math.round(baseRevenue * (1 + multiplier * 0.4));
  const prevRevenue = Math.round(revenue * 0.78);
  const prevLeads = Math.round(leads * 0.7);
  const prevCpl = Math.round(cpl * 1.45);
  const prevClose = Math.round(closeRate * 0.85);

  const revenueChart = [
    { month: "Sep", value: Math.round(prevRevenue * 0.7) },
    { month: "Oct", value: Math.round(prevRevenue * 0.8) },
    { month: "Nov", value: Math.round(prevRevenue * 0.9) },
    { month: "Dec", value: Math.round(prevRevenue) },
    { month: "Jan", value: Math.round(revenue * 0.9) },
    { month: "Feb", value: revenue },
  ];

  const campaigns = [
    { name: "Facebook", spend: Math.round(adSpend * 0.4), leads: Math.round(leads * 0.45), roas: parseFloat((roas * 0.9).toFixed(1)) },
    { name: "Google", spend: Math.round(adSpend * 0.35), leads: Math.round(leads * 0.3), roas: parseFloat((roas * 1.1).toFixed(1)) },
    { name: "TikTok", spend: Math.round(adSpend * 0.15), leads: Math.round(leads * 0.15), roas: parseFloat((roas * 0.8).toFixed(1)) },
    { name: "WhatsApp", spend: Math.round(adSpend * 0.1), leads: Math.round(leads * 0.1), roas: parseFloat((roas * 1.2).toFixed(1)) },
  ];

  const pipelineCounts = [
    { stage: "New Leads", count: Math.round(leads * 0.35), color: "#3b82f6" },
    { stage: "Contacted", count: Math.round(leads * 0.28), color: "#8b5cf6" },
    { stage: "Qualified", count: Math.round(leads * 0.18), color: "#06b6d4" },
    { stage: "Proposal", count: Math.round(leads * 0.1), color: "#f59e0b" },
    { stage: "Won", count: Math.round(leads * 0.06), color: "#10b981" },
    { stage: "Lost", count: Math.round(leads * 0.03), color: "#ef4444" },
  ];

  const modulePerf = client.activeModules.map((mod) => ({
    name: mod.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    score: Math.round(60 + health * 0.4 + Math.random() * 10),
    trend: Math.random() > 0.3 ? "up" : "down",
  }));

  const constraint =
    health < 60
      ? { type: "CPL TOO HIGH", impact: `RM ${Math.round(cpl * leads * 2)}/mo revenue leak`, fix: "Tighten ad targeting and improve landing page conversion above 5%" }
      : health < 80
      ? { type: "LOW CLOSE RATE", impact: `${Math.round(leads * (1 - closeRate / 100))} leads lost monthly`, fix: "Implement structured follow-up sequence within 2 hours of lead capture" }
      : { type: "SCALE OPPORTUNITY", impact: `Potential +RM ${Math.round(revenue * 0.3).toLocaleString()}/mo`, fix: "Ready to scale ad budget 2x — infrastructure is optimized for growth" };

  const actions = [
    { timeline: "30 days", title: "Optimize Ad Creative", desc: `A/B test 3 new creatives to bring CPL below RM ${Math.round(cpl * 0.8)}` },
    { timeline: "60 days", title: "Close Rate Training", desc: `Target ${closeRate + 5}% close rate with scripts and follow-up automation` },
    { timeline: "90 days", title: "Scale Budget", desc: `Increase ad spend by 30% targeting RM ${Math.round(revenue * 1.3).toLocaleString()} MRR` },
  ];

  return {
    client, tier, pkg, health,
    leads, cpl, closeRate, roas, adSpend, revenue,
    prevRevenue, prevLeads, prevCpl, prevClose,
    revenueChart, campaigns, pipelineCounts, modulePerf, constraint, actions,
  };
}

// ─── Slide shell ─────────────────────────────────────────────────────────────
function Slide({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "relative w-full rounded-3xl overflow-hidden border border-white/5",
      "bg-[#080c14]",
      className
    )}>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── Slide 1: Cover ──────────────────────────────────────────────────────────
function CoverSlide({ data }: { data: ReturnType<typeof getReportData> }) {
  const { client, pkg, health } = data;
  const healthColor = health >= 80 ? "#10b981" : health >= 60 ? "#f59e0b" : "#ef4444";
  const healthLabel = health >= 80 ? "EXCELLENT" : health >= 60 ? "GOOD" : "NEEDS ATTENTION";

  return (
    <Slide>
      <div className="min-h-[540px] flex flex-col justify-between p-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 flex items-center justify-center rounded-xl overflow-hidden bg-white/10">
              <Image src="/logo.png" alt="Agenz OS" width={28} height={28} className="h-6 w-6 object-contain" />
            </div>
            <span className="text-xs font-black tracking-[0.15em] text-white uppercase">AGENZ OS</span>
          </div>
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase"
            style={{ backgroundColor: `${healthColor}20`, color: healthColor, border: `1px solid ${healthColor}40` }}
          >
            {healthLabel} · {health}/100
          </span>
        </div>

        {/* Main content */}
        <div className="text-center space-y-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-[#3b82f6] uppercase mb-3">
              CLIENT PERFORMANCE REPORT
            </p>
            <h1 className="text-5xl font-black text-white tracking-tight leading-none">
              {client.businessName ?? client.name}
            </h1>
            <p className="text-base text-white/50 mt-2">{client.name} · {client.industry ?? "Digital Marketing"}</p>
          </div>

          {/* Stats triptych */}
          <div className="flex justify-center gap-10">
            {[
              { label: "PACKAGE", value: pkg?.label ?? client.packageTier },
              { label: "REPORT PERIOD", value: "Feb 2026" },
              { label: "MODULES", value: `${client.activeModules.length} Active` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-[9px] font-semibold tracking-widest text-white/30 uppercase">{label}</p>
                <p className="text-sm font-bold text-white mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/20">Prepared by Agenz MY · agenz.my</p>
          <p className="text-[10px] text-white/20">Confidential · February 2026</p>
        </div>

        {/* Decorative glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full blur-[80px] bg-[#3b82f6]/15 pointer-events-none" />
      </div>
    </Slide>
  );
}

// ─── Slide 2: Executive Summary ──────────────────────────────────────────────
function ExecSummarySlide({ data }: { data: ReturnType<typeof getReportData> }) {
  const { leads, cpl, closeRate, revenue, prevRevenue, prevLeads, prevCpl, prevClose } = data;
  const kpis = [
    { label: "Monthly Revenue", value: `RM ${revenue.toLocaleString()}`, prev: `RM ${prevRevenue.toLocaleString()}`, delta: Math.round(((revenue - prevRevenue) / prevRevenue) * 100), icon: DollarSign, color: "#10b981" },
    { label: "Leads / Month", value: leads.toString(), prev: prevLeads.toString(), delta: Math.round(((leads - prevLeads) / prevLeads) * 100), icon: Users, color: "#3b82f6" },
    { label: "Cost Per Lead", value: `RM ${cpl}`, prev: `RM ${prevCpl}`, delta: -Math.round(((prevCpl - cpl) / prevCpl) * 100), icon: Target, color: "#f59e0b", invertDelta: true },
    { label: "Close Rate", value: `${closeRate}%`, prev: `${prevClose}%`, delta: Math.round(((closeRate - prevClose) / prevClose) * 100), icon: TrendingUp, color: "#8b5cf6" },
  ];

  return (
    <Slide>
      <div className="p-8 space-y-6">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">02 / EXECUTIVE SUMMARY</p>
          <h2 className="text-2xl font-black text-white mt-1">Performance at a Glance</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const isPositive = kpi.invertDelta ? kpi.delta > 0 : kpi.delta > 0;
            return (
              <div key={kpi.label} className="rounded-2xl border border-white/5 bg-white/3 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: `${kpi.color}20` }}>
                    <kpi.icon className="h-4 w-4" style={{ color: kpi.color }} />
                  </div>
                  <span className={cn(
                    "flex items-center gap-0.5 text-[10px] font-bold rounded-full px-2 py-0.5",
                    isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(kpi.delta)}%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{kpi.value}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{kpi.label}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">prev: {kpi.prev}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-4">
          <p className="text-sm text-white/80 leading-relaxed">
            <span className="font-bold text-white">Summary: </span>
            Revenue grew <span className="text-emerald-400 font-semibold">+{Math.round(((revenue - prevRevenue) / prevRevenue) * 100)}%</span> this period.
            Lead volume increased to <span className="text-[#3b82f6] font-semibold">{leads}/month</span> while CPL dropped
            from <span className="text-red-400 font-semibold">RM {prevCpl}</span> to <span className="text-emerald-400 font-semibold">RM {cpl}</span>.
            Close rate is at <span className="text-[#8b5cf6] font-semibold">{closeRate}%</span> — above industry average of 12%.
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── Slide 3: Ads Performance ────────────────────────────────────────────────
function AdsSlide({ data }: { data: ReturnType<typeof getReportData> }) {
  const { campaigns, roas, cpl, adSpend } = data;
  const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

  return (
    <Slide>
      <div className="p-8 space-y-5">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">03 / ADS PERFORMANCE</p>
          <h2 className="text-2xl font-black text-white mt-1">Campaign Results</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Overall ROAS", value: `${roas}x`, sub: "Return on Ad Spend", color: "#10b981" },
            { label: "Avg CPL", value: `RM ${cpl}`, sub: "Cost Per Lead", color: "#3b82f6" },
            { label: "Total Spend", value: `RM ${adSpend.toLocaleString()}`, sub: "This period", color: "#8b5cf6" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/5 bg-white/3 p-5">
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: s.color }}>{s.label}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
            <p className="text-xs font-semibold text-white/60 mb-3">Leads by Campaign</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={campaigns} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                  {campaigns.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
            <p className="text-xs font-semibold text-white/60 mb-3">ROAS by Platform</p>
            <div className="space-y-3 mt-2">
              {campaigns.map((c, i) => (
                <div key={c.name}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/60">{c.name}</span>
                    <span className="font-bold text-white">{c.roas}x</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min((c.roas / 5) * 100, 100)}%`, backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── Slide 4: Lead Pipeline ──────────────────────────────────────────────────
function PipelineSlide({ data }: { data: ReturnType<typeof getReportData> }) {
  const { pipelineCounts, leads } = data;
  return (
    <Slide>
      <div className="p-8 space-y-5">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">04 / LEAD PIPELINE</p>
          <h2 className="text-2xl font-black text-white mt-1">Funnel Performance</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {pipelineCounts.map((stage) => (
            <div key={stage.stage} className="rounded-2xl border border-white/5 bg-white/3 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/40">{stage.stage}</span>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
              </div>
              <p className="text-3xl font-black text-white">{stage.count}</p>
              <p className="text-[10px] text-white/30 mt-1">{Math.round((stage.count / leads) * 100)}% of total</p>
              <div className="mt-2 h-1 rounded-full bg-white/5">
                <div className="h-full rounded-full" style={{ width: `${Math.round((stage.count / leads) * 100)}%`, backgroundColor: stage.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
            <p className="text-xs font-semibold text-white/60 mb-3">Stage Distribution</p>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={pipelineCounts} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="count">
                  {pipelineCounts.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/3 p-4 space-y-2">
            <p className="text-xs font-semibold text-white/60 mb-3">Key Metrics</p>
            {[
              { label: "Lead-to-Contact Rate", value: `${Math.round((pipelineCounts[1].count / pipelineCounts[0].count) * 100)}%` },
              { label: "Qualification Rate", value: `${Math.round((pipelineCounts[2].count / pipelineCounts[1].count) * 100)}%` },
              { label: "Proposal Rate", value: `${Math.round((pipelineCounts[3].count / pipelineCounts[2].count) * 100)}%` },
              { label: "Win Rate", value: `${Math.round((pipelineCounts[4].count / pipelineCounts[3].count) * 100)}%` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-[11px]">
                <span className="text-white/40">{label}</span>
                <span className="font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ─── Slide 5: Revenue Growth ─────────────────────────────────────────────────
function RevenueSlide({ data }: { data: ReturnType<typeof getReportData> }) {
  const { revenueChart, revenue, prevRevenue } = data;
  const growth = Math.round(((revenue - prevRevenue) / prevRevenue) * 100);
  return (
    <Slide>
      <div className="p-8 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">05 / REVENUE GROWTH</p>
            <h2 className="text-2xl font-black text-white mt-1">Monthly Recurring Revenue</h2>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-white">RM {revenue.toLocaleString()}</p>
            <span className="text-[10px] font-bold text-emerald-400">+{growth}% vs. 3 months ago</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `RM${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [`RM ${v.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "6-Mo Total", value: `RM ${revenueChart.reduce((s, r) => s + r.value, 0).toLocaleString()}` },
            { label: "Peak Month", value: `RM ${Math.max(...revenueChart.map((r) => r.value)).toLocaleString()}` },
            { label: "Avg Monthly", value: `RM ${Math.round(revenueChart.reduce((s, r) => s + r.value, 0) / 6).toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-white/5 bg-white/3 p-3 text-center">
              <p className="text-lg font-black text-white">{value}</p>
              <p className="text-[9px] text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

// ─── Slide 6: Module Performance ────────────────────────────────────────────
function ModulesSlide({ data }: { data: ReturnType<typeof getReportData> }) {
  const { modulePerf, client } = data;
  return (
    <Slide>
      <div className="p-8 space-y-5">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">06 / MODULE PERFORMANCE</p>
          <h2 className="text-2xl font-black text-white mt-1">Active Module Scorecard</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {modulePerf.map((mod) => {
            const color = mod.score >= 80 ? "#10b981" : mod.score >= 60 ? "#f59e0b" : "#ef4444";
            return (
              <div key={mod.name} className="rounded-2xl border border-white/5 bg-white/3 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold text-white/70">{mod.name}</p>
                  {mod.trend === "up"
                    ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    : <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                  }
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black" style={{ color }}>{mod.score}</p>
                  <p className="text-[9px] text-white/30">/100</p>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${mod.score}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}

          {modulePerf.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-8 w-8 text-white/20 mb-3" />
              <p className="text-sm text-white/40">No active modules yet</p>
              <p className="text-[10px] text-white/20 mt-1">Upgrade package to unlock modules</p>
            </div>
          )}
        </div>

        {modulePerf.length > 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/60">Average Module Score</p>
              <p className="text-lg font-black text-white">
                {Math.round(modulePerf.reduce((s, m) => s + m.score, 0) / modulePerf.length)}/100
              </p>
            </div>
          </div>
        )}
      </div>
    </Slide>
  );
}

// ─── Slide 7: Constraint Diagnosis ───────────────────────────────────────────
function ConstraintSlide({ data }: { data: ReturnType<typeof getReportData> }) {
  const { constraint, health } = data;
  const isOpportunity = health >= 80;
  const color = isOpportunity ? "#10b981" : health >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <Slide>
      <div className="p-8 space-y-6">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">07 / CONSTRAINT DIAGNOSIS</p>
          <h2 className="text-2xl font-black text-white mt-1">Primary Growth Bottleneck</h2>
        </div>

        <div className="rounded-3xl border p-8 text-center" style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}>
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}20` }}>
              {isOpportunity
                ? <Sparkles className="h-8 w-8" style={{ color }} />
                : <AlertTriangle className="h-8 w-8" style={{ color }} />
              }
            </div>
          </div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color }}>
            {isOpportunity ? "GROWTH OPPORTUNITY DETECTED" : "CONSTRAINT IDENTIFIED"}
          </p>
          <h3 className="text-3xl font-black text-white">{constraint.type}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/3 p-5">
            <p className="text-[9px] font-semibold tracking-widest text-white/30 uppercase mb-3">IMPACT</p>
            <p className="text-sm font-semibold text-white leading-relaxed">{constraint.impact}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/3 p-5">
            <p className="text-[9px] font-semibold tracking-widest text-white/30 uppercase mb-3">RECOMMENDED FIX</p>
            <p className="text-sm font-semibold text-white leading-relaxed">{constraint.fix}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-[#3b82f6] flex-shrink-0" />
          <p className="text-xs text-white/70">
            This diagnosis is auto-generated based on your current KPIs vs. industry benchmarks.
            Your Agenz strategist will review this in your next monthly call.
          </p>
        </div>
      </div>
    </Slide>
  );
}

// ─── Slide 8: Action Plan ─────────────────────────────────────────────────────
function ActionPlanSlide({ data }: { data: ReturnType<typeof getReportData> }) {
  const { actions, client } = data;
  return (
    <Slide>
      <div className="p-8 space-y-5">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">08 / ACTION PLAN</p>
          <h2 className="text-2xl font-black text-white mt-1">Next 90 Days Roadmap</h2>
        </div>

        <div className="space-y-4">
          {actions.map((action, i) => {
            const colors = ["#3b82f6", "#8b5cf6", "#10b981"];
            return (
              <div key={i} className="flex gap-4 rounded-2xl border border-white/5 bg-white/3 p-5">
                <div className="flex-shrink-0">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black text-white"
                    style={{ backgroundColor: `${colors[i]}20`, color: colors[i], border: `1px solid ${colors[i]}40` }}
                  >
                    {action.timeline.split(" ")[0]}
                  </div>
                  <p className="text-[8px] text-white/30 text-center mt-1">{action.timeline.split(" ")[1]}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{action.title}</p>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 flex-shrink-0 mt-1 ml-auto" />
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/3 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white">Next Strategy Call</p>
            <p className="text-[10px] text-white/40 mt-0.5">March 7, 2026 · 3:00 PM</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-[#3b82f6] px-4 py-2 text-xs font-bold text-white hover:bg-[#3b82f6]/90 transition-colors">
            <Calendar className="h-3.5 w-3.5" />
            Reschedule
          </button>
        </div>
      </div>
    </Slide>
  );
}

// ─── Agency Overview Report ──────────────────────────────────────────────────
function AgencyReportSlide({ slideIndex }: { slideIndex: number }) {
  const clients = mockClients.filter((c) => c.packageTier !== "NONE");
  const totalMRR = clients.reduce((s, c) => s + (PACKAGE_CONFIG[c.packageTier]?.price ?? 0), 0);
  const avgHealth = Math.round(clients.reduce((s, c) => s + (c.healthScore ?? 50), 0) / clients.length);
  const criticalCount = clients.filter((c) => (c.healthScore ?? 100) < 60).length;

  const mrrByMonth = [
    { month: "Sep", value: 11200 },
    { month: "Oct", value: 12500 },
    { month: "Nov", value: 13000 },
    { month: "Dec", value: 13800 },
    { month: "Jan", value: 14200 },
    { month: "Feb", value: totalMRR },
  ];

  const slides = [
    // Agency cover
    <Slide key="ag-cover">
      <div className="min-h-[540px] flex flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 flex items-center justify-center rounded-xl overflow-hidden bg-white/10">
            <Image src="/logo.png" alt="Agenz OS" width={28} height={28} className="h-6 w-6 object-contain" />
          </div>
          <span className="text-xs font-black tracking-[0.15em] text-white uppercase">AGENZ OS</span>
        </div>
        <div className="text-center space-y-4">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-[#3b82f6] uppercase">INTERNAL AGENCY REPORT</p>
          <h1 className="text-5xl font-black text-white">Agenz MY</h1>
          <p className="text-white/40">February 2026 · Confidential</p>
          <div className="flex justify-center gap-8 mt-4">
            {[
              { label: "MRR", value: `RM ${totalMRR.toLocaleString()}` },
              { label: "Clients", value: clients.length.toString() },
              { label: "Avg Health", value: `${avgHealth}/100` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-[9px] tracking-widest text-white/30 uppercase">{label}</p>
                <p className="text-xl font-black text-white mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-white/20 text-center">Prepared for internal use only</p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full blur-[80px] bg-[#8b5cf6]/15 pointer-events-none" />
      </div>
    </Slide>,

    // MRR growth
    <Slide key="ag-mrr">
      <div className="p-8 space-y-5">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">02 / REVENUE</p>
          <h2 className="text-2xl font-black text-white mt-1">MRR Growth Trajectory</h2>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mrrByMonth}>
              <defs>
                <linearGradient id="agMrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `RM${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`RM ${v.toLocaleString()}`, "MRR"]} />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#agMrrGrad)" dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Current MRR", value: `RM ${totalMRR.toLocaleString()}` },
            { label: "ARR Run Rate", value: `RM ${(totalMRR * 12 / 1000).toFixed(0)}K` },
            { label: "MoM Growth", value: "+12.3%" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-white/5 bg-white/3 p-3 text-center">
              <p className="text-lg font-black text-white">{value}</p>
              <p className="text-[9px] text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>,

    // Client health
    <Slide key="ag-health">
      <div className="p-8 space-y-5">
        <div>
          <p className="text-[9px] font-semibold tracking-[0.3em] text-[#3b82f6]/70 uppercase">03 / CLIENT HEALTH</p>
          <h2 className="text-2xl font-black text-white mt-1">Portfolio Health Matrix</h2>
        </div>
        <div className="space-y-2">
          {clients.map((c) => {
            const h = c.healthScore ?? 50;
            const color = h >= 80 ? "#10b981" : h >= 60 ? "#f59e0b" : "#ef4444";
            const pkg = PACKAGE_CONFIG[c.packageTier];
            return (
              <div key={c.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 px-4 py-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-[10px] font-bold text-white">
                  {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{c.businessName ?? c.name}</p>
                  <p className="text-[10px] text-white/30">{pkg?.label ?? c.packageTier} · {c.activeModules.length} modules</p>
                </div>
                <div className="w-32">
                  <div className="h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${h}%`, backgroundColor: color }} />
                  </div>
                </div>
                <span className="text-xs font-black w-10 text-right" style={{ color }}>{h}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4">
          {[
            { label: "Healthy", count: clients.filter((c) => (c.healthScore ?? 0) >= 80).length, color: "#10b981" },
            { label: "Warning", count: clients.filter((c) => (c.healthScore ?? 0) >= 60 && (c.healthScore ?? 0) < 80).length, color: "#f59e0b" },
            { label: "Critical", count: criticalCount, color: "#ef4444" },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex-1 rounded-xl border border-white/5 bg-white/3 p-3 text-center">
              <p className="text-xl font-black" style={{ color }}>{count}</p>
              <p className="text-[9px] text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </Slide>,
  ];

  return slides[Math.min(slideIndex, slides.length - 1)];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TOTAL_CLIENT_SLIDES = 8;
const TOTAL_AGENCY_SLIDES = 3;

export default function ReportsPage() {
  const activeClients = mockClients.filter((c) => c.packageTier !== "NONE");
  const [mode, setMode] = useState<"agency" | "client">("agency");
  const [selectedClientId, setSelectedClientId] = useState(activeClients[0]?.id ?? "c1");
  const [slideIndex, setSlideIndex] = useState(0);

  const totalSlides = mode === "agency" ? TOTAL_AGENCY_SLIDES : TOTAL_CLIENT_SLIDES;

  const prev = () => setSlideIndex((s) => Math.max(0, s - 1));
  const next = () => setSlideIndex((s) => Math.min(totalSlides - 1, s + 1));

  const reportData = getReportData(selectedClientId);

  const clientSlides = [
    <CoverSlide key="cover" data={reportData} />,
    <ExecSummarySlide key="exec" data={reportData} />,
    <AdsSlide key="ads" data={reportData} />,
    <PipelineSlide key="pipeline" data={reportData} />,
    <RevenueSlide key="revenue" data={reportData} />,
    <ModulesSlide key="modules" data={reportData} />,
    <ConstraintSlide key="constraint" data={reportData} />,
    <ActionPlanSlide key="actions" data={reportData} />,
  ];

  const slideLabels =
    mode === "agency"
      ? ["Cover", "MRR Growth", "Client Health"]
      : ["Cover", "Executive Summary", "Ads Performance", "Lead Pipeline", "Revenue Growth", "Modules", "Constraint", "Action Plan"];

  return (
    <div className="p-5 space-y-4 max-w-[960px] mx-auto">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Performance Reports</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Auto-generated from live client data</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex rounded-xl border border-border overflow-hidden">
            {(["agency", "client"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setSlideIndex(0); }}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold transition-colors capitalize",
                  mode === m ? "bg-[#3b82f6] text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "agency" ? "Agency Report" : "Client Report"}
              </button>
            ))}
          </div>

          {/* Client selector */}
          {mode === "client" && (
            <select
              value={selectedClientId}
              onChange={(e) => { setSelectedClientId(e.target.value); setSlideIndex(0); }}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
            >
              {activeClients.map((c) => (
                <option key={c.id} value={c.id}>{c.businessName ?? c.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Slide label tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {slideLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setSlideIndex(i)}
            className={cn(
              "flex-shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all",
              slideIndex === i
                ? "bg-[#3b82f6] text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Slide */}
      <div className="relative">
        {mode === "agency"
          ? <AgencyReportSlide slideIndex={slideIndex} />
          : clientSlides[slideIndex]
        }
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={slideIndex === 0}
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={cn(
                "rounded-full transition-all",
                i === slideIndex ? "h-2 w-6 bg-[#3b82f6]" : "h-2 w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={slideIndex === totalSlides - 1}
          className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground/40">
        Slide {slideIndex + 1} of {totalSlides} · Auto-generated by Agenz OS
      </p>
    </div>
  );
}
