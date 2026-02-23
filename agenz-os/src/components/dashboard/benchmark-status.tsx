"use client";

import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenchmarkRow {
  metric: string;
  yours: string;
  benchmark: string;
  status: "good" | "warning" | "critical";
  unit?: string;
}

const benchmarkData: BenchmarkRow[] = [
  {
    metric: "Cost Per Lead (CPL)",
    yours: "RM 34",
    benchmark: "RM 10–20",
    status: "critical",
  },
  {
    metric: "Customer Acq. Cost (CAC)",
    yours: "RM 680",
    benchmark: "RM 200–400",
    status: "critical",
  },
  {
    metric: "Close Rate",
    yours: "12%",
    benchmark: "20–35%",
    status: "critical",
  },
  {
    metric: "Return on Ad Spend",
    yours: "2.1x",
    benchmark: "3–5x",
    status: "warning",
  },
  {
    metric: "Lifetime Value (LTV)",
    yours: "RM 4,200",
    benchmark: "RM 4,500–8,000",
    status: "warning",
  },
  {
    metric: "Monthly Revenue Growth",
    yours: "+13.3%",
    benchmark: "10–25%",
    status: "good",
  },
];

const statusIcon = {
  good: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  warning: <AlertTriangle className="h-4 w-4 text-orange-400" />,
  critical: <XCircle className="h-4 w-4 text-red-400" />,
};

const statusLabel = {
  good: { text: "On Target", className: "text-emerald-400 bg-emerald-500/10" },
  warning: { text: "Below Target", className: "text-orange-400 bg-orange-500/10" },
  critical: { text: "Critical", className: "text-red-400 bg-red-500/10" },
};

export function BenchmarkStatus() {
  const critical = benchmarkData.filter((r) => r.status === "critical").length;
  const warning = benchmarkData.filter((r) => r.status === "warning").length;
  const good = benchmarkData.filter((r) => r.status === "good").length;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Industry Benchmark</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Solar Energy · Malaysia</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            <span className="text-red-400 font-medium">{critical} Critical</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span className="text-orange-400 font-medium">{warning} Warning</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-medium">{good} Good</span>
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {benchmarkData.map((row) => (
          <div
            key={row.metric}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
              row.status === "critical" && "bg-red-500/5 hover:bg-red-500/8",
              row.status === "warning" && "bg-orange-500/5 hover:bg-orange-500/8",
              row.status === "good" && "bg-emerald-500/5 hover:bg-emerald-500/8"
            )}
          >
            {statusIcon[row.status]}
            <span className="flex-1 text-xs text-foreground font-medium">{row.metric}</span>
            <div className="flex items-center gap-3 text-xs">
              <span
                className={cn(
                  "font-bold",
                  row.status === "critical" && "text-red-400",
                  row.status === "warning" && "text-orange-400",
                  row.status === "good" && "text-emerald-400"
                )}
              >
                {row.yours}
              </span>
              <span className="text-muted-foreground">vs</span>
              <span className="text-muted-foreground/80 font-medium">{row.benchmark}</span>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                statusLabel[row.status].className
              )}
            >
              {statusLabel[row.status].text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
