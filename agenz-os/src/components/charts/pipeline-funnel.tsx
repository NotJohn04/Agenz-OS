"use client";

import { getPipelineStages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function PipelineFunnel() {
  const stages = getPipelineStages();
  const maxCount = Math.max(...stages.map((s) => s.count));

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Pipeline Funnel</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Active deal stages</p>
        </div>
        <Link
          href="/crm"
          className="text-[11px] text-[#3b82f6] hover:text-[#06b6d4] transition-colors font-medium"
        >
          Open CRM →
        </Link>
      </div>

      <div className="space-y-2">
        {stages.map((stage, i) => {
          const width = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const prevCount = i > 0 ? stages[i - 1].count : stage.count;
          const dropOff = i > 0 && prevCount > 0 ? Math.round(((prevCount - stage.count) / prevCount) * 100) : 0;

          return (
            <div key={stage.stage} className="group">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{stage.label}</span>
                <div className="flex items-center gap-3">
                  {i > 0 && dropOff > 0 && (
                    <span className={cn(
                      "text-[10px] font-medium",
                      dropOff > 40 ? "text-red-400" : dropOff > 20 ? "text-orange-400" : "text-muted-foreground"
                    )}>
                      -{dropOff}%
                    </span>
                  )}
                  <span className="font-bold text-foreground">{stage.count}</span>
                  <span className="text-muted-foreground/60 text-[10px]">
                    RM {(stage.totalValue / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
              <div className="h-7 w-full rounded-md bg-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center px-2 transition-all duration-500"
                  style={{
                    width: `${Math.max(width, 8)}%`,
                    backgroundColor: stage.color,
                    opacity: 0.8,
                  }}
                >
                  {stage.count > 0 && width > 20 && (
                    <span className="text-[10px] font-semibold text-white">
                      {stage.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Total Leads</p>
          <p className="text-lg font-bold text-foreground">
            {stages.reduce((s, st) => s + st.count, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Pipeline Value</p>
          <p className="text-lg font-bold text-[#3b82f6]">
            RM {(stages.reduce((s, st) => s + st.totalValue, 0) / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Win Rate</p>
          <p className="text-lg font-bold text-emerald-400">
            {stages[0].count > 0
              ? Math.round((stages[5].count / stages[0].count) * 100)
              : 0}
            %
          </p>
        </div>
      </div>
    </div>
  );
}
