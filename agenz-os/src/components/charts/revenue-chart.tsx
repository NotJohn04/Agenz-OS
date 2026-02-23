"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { revenueChartData } from "@/lib/mock-data";

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#111] p-3 text-xs shadow-2xl">
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-400 capitalize">{entry.name}:</span>
            <span className="font-semibold text-white">
              RM {(entry.value / 1000).toFixed(1)}K
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue vs Baseline</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 7 months · RM</p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-sm bg-[#3b82f6]" />
            <span className="text-muted-foreground">Revenue</span>
          </span>
          <span className="flex items-center gap-1.5">
            <div className="h-px w-4 border-t-2 border-dashed border-muted-foreground/50" />
            <span className="text-muted-foreground">Baseline</span>
          </span>
          <span className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-sm bg-[#10b981]" />
            <span className="text-muted-foreground">Profit</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={45000}
            stroke="#9ca3af"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{ value: "Baseline", position: "right", fontSize: 9, fill: "#9ca3af" }}
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={1.5}
            fill="url(#profitGradient)"
            dot={false}
            name="profit"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#revGradient)"
            dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#3b82f6" }}
            name="revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
