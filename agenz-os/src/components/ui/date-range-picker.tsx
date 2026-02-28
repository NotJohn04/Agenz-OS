"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type DatePreset = "30D" | "3M" | "6M" | "YTD" | "1Y" | "ALL" | "CUSTOM";

export interface DateRange {
  from: Date;
  to: Date;
  preset: DatePreset;
}

// Earliest data point in the system (Sep 2025)
export const DATA_EPOCH = new Date(2025, 8, 1);

export function getPresetRange(preset: DatePreset): { from: Date; to: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (preset) {
    case "30D": return { from: new Date(today.getTime() - 30 * 86_400_000), to: today };
    case "3M":  return { from: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()), to: today };
    case "6M":  return { from: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()), to: today };
    case "YTD": return { from: new Date(today.getFullYear(), 0, 1), to: today };
    case "1Y":  return { from: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()), to: today };
    case "ALL": return { from: DATA_EPOCH, to: today };
    default:    return { from: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()), to: today };
  }
}

export function makeRange(preset: DatePreset): DateRange {
  return { ...getPresetRange(preset), preset };
}

export function fmtDateRange(from: Date, to: Date) {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "2-digit" });
  return `${fmt(from)} – ${fmt(to)}`;
}

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "30D",    label: "30D" },
  { key: "3M",     label: "3M" },
  { key: "6M",     label: "6M" },
  { key: "YTD",    label: "YTD" },
  { key: "1Y",     label: "1Y" },
  { key: "ALL",    label: "All" },
  { key: "CUSTOM", label: "Custom" },
];

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState(() => value.from.toISOString().split("T")[0]);
  const [customTo,   setCustomTo]   = useState(() => value.to.toISOString().split("T")[0]);

  function selectPreset(preset: DatePreset) {
    if (preset === "CUSTOM") { setShowCustom(true); return; }
    setShowCustom(false);
    onChange({ ...getPresetRange(preset), preset });
  }

  function applyCustom() {
    const from = new Date(customFrom);
    const to   = new Date(customTo);
    if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && from <= to) {
      onChange({ from, to, preset: "CUSTOM" });
      setShowCustom(false);
    }
  }

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Preset pills */}
      <div className="flex items-center rounded-xl border border-border bg-card p-1 gap-0.5">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => selectPreset(p.key)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
              value.preset === p.key
                ? "bg-[#3b82f6] text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Date label */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground whitespace-nowrap">
        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
        <span>{fmtDateRange(value.from, value.to)}</span>
      </div>

      {/* Custom date inputs */}
      {showCustom && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded-lg border border-border bg-muted px-2 py-1 text-[11px] text-foreground"
          />
          <span className="text-[11px] text-muted-foreground">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="rounded-lg border border-border bg-muted px-2 py-1 text-[11px] text-foreground"
          />
          <button
            onClick={applyCustom}
            className="rounded-lg bg-[#3b82f6] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#2563eb]"
          >
            Apply
          </button>
          <button
            onClick={() => setShowCustom(false)}
            className="rounded-lg bg-muted px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
