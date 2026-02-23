"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPIMetric } from "@/types";
import { Sparkline } from "./sparkline";

interface KPICardProps {
  metric: KPIMetric;
  className?: string;
}

const statusConfig = {
  good: {
    deltaColor: "text-emerald-400",
    border: "border-emerald-500/10",
    glow: "",
    bg: "bg-emerald-500/5",
    icon: TrendingUp,
    iconColor: "text-emerald-400",
  },
  warning: {
    deltaColor: "text-orange-400",
    border: "border-orange-500/10",
    glow: "",
    bg: "bg-orange-500/5",
    icon: TrendingDown,
    iconColor: "text-orange-400",
  },
  critical: {
    deltaColor: "text-red-400",
    border: "border-red-500/20",
    glow: "shadow-[0_0_24px_rgba(239,68,68,0.08)]",
    bg: "bg-red-500/5",
    icon: TrendingDown,
    iconColor: "text-red-400",
  },
};

function formatValue(value: number | string, unit: string): string {
  if (typeof value === "string") return value;
  if (unit === "RM") {
    if (value >= 1000) return `RM ${(value / 1000).toFixed(1)}K`;
    return `RM ${value}`;
  }
  if (unit === "%") return `${value}%`;
  if (unit === "leads") return value.toString();
  return `${value} ${unit}`;
}

export function KPICard({ metric, className }: KPICardProps) {
  const config = statusConfig[metric.status];
  const TrendIcon = metric.trend === "flat" ? Minus : config.icon;
  const isPositiveDelta = metric.delta > 0;

  // For CPL and CAC, up is bad
  const isInvertedMetric = metric.label.includes("CPL") || metric.label.includes("CAC");

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card p-5 transition-all duration-200 hover:shadow-md",
        config.border,
        config.glow,
        className
      )}
    >
      {/* Status accent line */}
      <div
        className={cn(
          "absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full",
          metric.status === "good" && "bg-emerald-400",
          metric.status === "warning" && "bg-orange-400",
          metric.status === "critical" && "bg-red-400"
        )}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {metric.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground leading-none">
              {formatValue(
                typeof metric.value === "number" ? metric.value : metric.value,
                metric.unit
              )}
            </p>
          </div>

          {/* Trend indicator */}
          <div
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold",
              metric.status === "good" && "bg-emerald-500/10 text-emerald-400",
              metric.status === "warning" && "bg-orange-500/10 text-orange-400",
              metric.status === "critical" && "bg-red-500/10 text-red-400"
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {metric.delta > 0 ? "+" : ""}
            {Math.abs(metric.delta).toFixed(1)}%
          </div>
        </div>

        {/* Sparkline chart */}
        {metric.sparklineData && (
          <div className="mb-3">
            <Sparkline
              data={metric.sparklineData}
              color={
                metric.status === "good"
                  ? "#10b981"
                  : metric.status === "warning"
                  ? "#f97316"
                  : "#ef4444"
              }
            />
          </div>
        )}

        {/* Baseline comparison */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Baseline:</span>
            <span className="font-medium text-foreground">
              {formatValue(metric.baseline, metric.unit)}
            </span>
          </div>

          {/* Industry benchmark */}
          {metric.industryMin !== undefined && metric.industryMax !== undefined && (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-muted-foreground/60">Benchmark:</span>
              <span
                className={cn(
                  "font-semibold",
                  metric.status === "critical" && "text-red-400",
                  metric.status === "warning" && "text-orange-400",
                  metric.status === "good" && "text-emerald-400"
                )}
              >
                {metric.unit === "RM"
                  ? `RM ${metric.industryMin}–${metric.industryMax}`
                  : `${metric.industryMin}–${metric.industryMax}${metric.unit === "%" ? "%" : ""}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
