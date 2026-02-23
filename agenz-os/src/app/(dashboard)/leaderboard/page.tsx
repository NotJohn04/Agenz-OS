"use client";

import { mockLeaderboard } from "@/lib/mock-data";
import { PACKAGE_CONFIG } from "@/lib/constants";
import { Trophy, Star, CheckCircle2, XCircle, Zap, Crown, Medal, Award } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const rankIcons: Record<number, { icon: React.ComponentType<LucideProps>, color: string, label: string }> = {
  1: { icon: Crown, color: "#f59e0b", label: "Gold" },
  2: { icon: Medal, color: "#94a3b8", label: "Silver" },
  3: { icon: Award, color: "#b45309", label: "Bronze" },
};

const eligibilityRequirements = [
  "CRM must be active with real data",
  "Course completion: 100%",
  "Subscription must be active",
  "Revenue audited — fraud check required for refund",
];

export default function LeaderboardPage() {
  const topPerformer = mockLeaderboard[0];
  const eligible = mockLeaderboard.filter(e => e.isEligible).length;
  const doubled = mockLeaderboard.filter(e => e.hasDoubled).length;

  const chartData = mockLeaderboard.map(e => ({
    name: e.businessName.split(" ")[0],
    growth: e.growthPercentage,
    doubled: e.hasDoubled,
  }));

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-[#f59e0b]" />
            <h1 className="text-xl font-bold text-foreground">Leaderboard</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Revenue growth since joining Agenz OS ·{" "}
            <span className="text-[#3b82f6] font-medium">{eligible} eligible</span> ·{" "}
            {doubled > 0 && <span className="text-emerald-400 font-medium">{doubled} doubled revenue ✓</span>}
          </p>
        </div>
        <div className="rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-2.5 text-center">
          <p className="text-[10px] text-[#f59e0b]/70 uppercase tracking-wider">Grand Prize</p>
          <p className="text-sm font-bold text-[#f59e0b]">🚗 Win a Car</p>
          <p className="text-[10px] text-[#f59e0b]/60">Top Revenue Growth</p>
        </div>
      </div>

      {/* Hero: Top performer */}
      {topPerformer && (
        <div className="relative rounded-2xl overflow-hidden border border-[#f59e0b]/25 bg-gradient-to-br from-[#f59e0b]/10 to-[#8b5cf6]/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/5 to-transparent" />
          <div className="relative flex items-center gap-6 p-6">
            <div className="relative flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#f59e0b]/60 text-xl font-bold text-white shadow-[0_0_24px_rgba(245,158,11,0.4)]">
                {topPerformer.clientName.charAt(0)}
              </div>
              <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                <Crown className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]">#1 Top Performer</p>
                {topPerformer.hasDoubled && (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px]">
                    2x Revenue ✓
                  </Badge>
                )}
              </div>
              <p className="text-xl font-bold text-foreground">{topPerformer.businessName}</p>
              <p className="text-sm text-muted-foreground">{topPerformer.clientName} · {topPerformer.industry}</p>
              <div className="mt-2 flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">Baseline: <strong className="text-foreground">RM {(topPerformer.baselineRevenue / 1000).toFixed(0)}K</strong></span>
                <span className="text-muted-foreground">→</span>
                <span className="text-muted-foreground">Current: <strong className="text-emerald-400">RM {(topPerformer.currentRevenue / 1000).toFixed(0)}K</strong></span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-5xl font-black text-[#f59e0b]">+{topPerformer.growthPercentage.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Revenue Growth</p>
              <Badge className="mt-2 bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/20">
                {PACKAGE_CONFIG[topPerformer.packageTier].label}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Chart + Eligibility Requirements */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        {/* Growth bar chart */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Revenue Growth % — All Clients</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `+${v}%`} />
              <Tooltip formatter={(v) => v != null ? [`+${Number(v).toFixed(1)}%`, "Growth"] : ["-", "Growth"]} contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              {/* 100% doubling line */}
              <Bar dataKey="growth" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.doubled ? "#f59e0b" : d.growth > 50 ? "#10b981" : d.growth > 20 ? "#3b82f6" : "#6b7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#f59e0b]" /><span>2x Revenue</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#10b981]" /><span>{">"}50% Growth</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#3b82f6]" /><span>{">"}20% Growth</span></div>
          </div>
        </div>

        {/* Competition Rules */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#3b82f6]" />
            Competition Rules
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold text-[#f59e0b] mb-2">🏆 Grand Prize: Win a Car</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Top performer by revenue growth % at competition end date wins the car prize.</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-emerald-400 mb-2">💰 Revenue 2x = Refund Eligible</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">If your revenue doubles from your baseline, you can claim a full refund or 10-month service credit.</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Eligibility Requirements</p>
              {eligibilityRequirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-[#3b82f6]" />
                  <span className="text-[11px] text-muted-foreground">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rankings table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Full Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {["Rank", "Business", "Package", "Baseline", "Current", "Growth %", "Eligible", "Status"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((entry) => {
                const rankInfo = rankIcons[entry.rank];
                const pkgConf = PACKAGE_CONFIG[entry.packageTier];
                return (
                  <tr key={entry.clientId} className={cn("border-b border-border/30 hover:bg-muted/20 transition-colors", entry.rank === 1 && "bg-[#f59e0b]/5")}>
                    <td className="px-4 py-3">
                      {rankInfo ? (
                        <div className="flex items-center gap-2">
                          <rankInfo.icon className="h-4 w-4" style={{ color: rankInfo.color }} />
                          <span className="text-sm font-bold" style={{ color: rankInfo.color }}>#{entry.rank}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: entry.rank === 1 ? "linear-gradient(135deg, #f59e0b, #f59e0b80)" : "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                          {entry.clientName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{entry.businessName}</p>
                          <p className="text-[10px] text-muted-foreground">{entry.clientName} · {entry.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold" style={{ color: pkgConf.color }}>{pkgConf.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">RM {(entry.baselineRevenue / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-foreground">RM {(entry.currentRevenue / 1000).toFixed(0)}K</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-sm font-black",
                        entry.growthPercentage >= 100 ? "text-[#f59e0b]" :
                        entry.growthPercentage >= 50 ? "text-emerald-400" :
                        entry.growthPercentage >= 20 ? "text-[#3b82f6]" : "text-muted-foreground"
                      )}>
                        +{entry.growthPercentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.isEligible ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entry.hasDoubled ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-[#f59e0b]/10 px-2 py-1">
                          <Star className="h-3 w-3 text-[#f59e0b]" />
                          <span className="text-[10px] font-bold text-[#f59e0b]">2x Revenue!</span>
                        </div>
                      ) : entry.isEligible ? (
                        <span className="text-[10px] text-emerald-400 font-medium">Competition Ready</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Not eligible yet</span>
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
