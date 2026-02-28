"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export type DatePreset = "30D" | "3M" | "6M" | "YTD" | "1Y" | "ALL" | "CUSTOM";

export interface DateRange {
  from: Date;
  to: Date;
  preset: DatePreset;
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const DATA_EPOCH = new Date(2025, 8, 1);

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "30D",    label: "30D" },
  { key: "3M",     label: "3M" },
  { key: "6M",     label: "6M" },
  { key: "YTD",    label: "YTD" },
  { key: "1Y",     label: "1Y" },
  { key: "ALL",    label: "All" },
  { key: "CUSTOM", label: "Custom" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fmtShort(d: Date) {
  return d.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
}

// ─── DateRangePicker ──────────────────────────────────────────────────────────
interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempFrom, setTempFrom]     = useState<Date | null>(null);
  const [tempTo, setTempTo]         = useState<Date | null>(null);
  const [picking, setPicking]       = useState<"from" | "to">("from");
  const [hoverDay, setHoverDay]     = useState<Date | null>(null);
  const [viewYear, setViewYear]     = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth]   = useState(new Date().getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Close calendar when clicking outside
  useEffect(() => {
    if (!showCalendar) return;
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showCalendar]);

  function openCustom() {
    setTempFrom(value.from);
    setTempTo(value.to);
    setViewYear(value.from.getFullYear());
    setViewMonth(value.from.getMonth());
    setPicking("from");
    setHoverDay(null);
    setShowCalendar(true);
  }

  function selectPreset(preset: DatePreset) {
    if (preset === "CUSTOM") { openCustom(); return; }
    setShowCalendar(false);
    onChange({ ...getPresetRange(preset), preset });
  }

  function handleDayClick(d: Date) {
    if (picking === "from") {
      setTempFrom(d);
      setTempTo(null);
      setHoverDay(null);
      setPicking("to");
    } else {
      if (tempFrom && d < tempFrom) {
        // Clicked before start — restart selection
        setTempFrom(d);
        setTempTo(null);
        setHoverDay(null);
        setPicking("to");
      } else {
        setTempTo(d);
        setHoverDay(null);
        // Keep picking "to" so user can adjust if needed
      }
    }
  }

  function applyCustom() {
    if (tempFrom && tempTo) {
      onChange({ from: tempFrom, to: tempTo, preset: "CUSTOM" });
      setShowCalendar(false);
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  // Calendar grid cells
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDow    = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));
  while (cells.length % 7 !== 0) cells.push(null);

  // Preview end: when picking "to", show hover preview
  const previewEnd = picking === "to" ? (hoverDay ?? tempTo) : tempTo;

  return (
    <div ref={containerRef} className={cn("relative flex items-center gap-2 flex-wrap", className)}>
      {/* Preset pill bar */}
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

      {/* Active date range label */}
      <button
        onClick={openCustom}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-muted-foreground whitespace-nowrap hover:bg-muted hover:text-foreground transition-colors"
      >
        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
        <span>{fmtDateRange(value.from, value.to)}</span>
      </button>

      {/* ─── Custom Calendar Popup ─────────────────────────────────────────── */}
      {showCalendar && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[308px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <button
              onClick={prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-sm font-bold text-foreground select-none">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-3">
            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 mb-1">
              {WEEK_DAYS.map((d) => (
                <div key={d} className="h-7 flex items-center justify-center text-[10px] font-semibold text-muted-foreground/60 select-none">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {cells.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} className="h-9" />;

                const isFrom     = tempFrom ? isSameDay(d, tempFrom) : false;
                const isTo       = tempTo   ? isSameDay(d, tempTo)   : false;
                const isEnd      = previewEnd && !isFrom ? isSameDay(d, previewEnd) : false;
                const inRange    = !!(tempFrom && previewEnd && d > tempFrom && d < previewEnd);
                const isToday    = isSameDay(d, today);
                const isEdge     = isFrom || isTo;
                // Range highlight spans: left-half for "to" edge, right-half for "from" edge
                const rangeClass = inRange ? "bg-[#3b82f6]/10" : "";

                return (
                  <div key={`day-${i}`} className={cn("relative h-9", rangeClass)}>
                    {/* Range fill bridges */}
                    {inRange && <div className="absolute inset-0 bg-[#3b82f6]/10" />}
                    {/* Left bridge on end-day */}
                    {(isTo || isEnd) && tempFrom && previewEnd && !isSameDay(tempFrom, previewEnd) && (
                      <div className="absolute inset-y-1 left-0 w-1/2 bg-[#3b82f6]/10" />
                    )}
                    {/* Right bridge on from-day */}
                    {isFrom && previewEnd && !isSameDay(tempFrom!, previewEnd) && (
                      <div className="absolute inset-y-1 right-0 w-1/2 bg-[#3b82f6]/10" />
                    )}

                    <button
                      onClick={() => handleDayClick(d)}
                      onMouseEnter={() => picking === "to" && setHoverDay(d)}
                      onMouseLeave={() => picking === "to" && setHoverDay(null)}
                      className={cn(
                        "absolute inset-1 flex items-center justify-center rounded-lg text-[12px] font-medium transition-all select-none",
                        isEdge
                          ? "bg-[#3b82f6] text-white font-bold shadow-sm"
                          : isEnd && previewEnd
                          ? "bg-[#3b82f6]/40 text-white"
                          : "hover:bg-muted text-foreground",
                        isToday && !isEdge && !isEnd
                          ? "ring-1 ring-[#3b82f6]/50 font-bold text-[#3b82f6]"
                          : ""
                      )}
                    >
                      {d.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selection summary */}
          <div className="mx-3 mb-3 flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-0.5">FROM</p>
              <p className={cn("text-xs font-semibold truncate", tempFrom ? "text-foreground" : "text-muted-foreground/40")}>
                {tempFrom ? fmtShort(tempFrom) : "Click a start date"}
              </p>
            </div>
            <div className="h-px w-6 flex-shrink-0 bg-border" />
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-0.5">TO</p>
              <p className={cn("text-xs font-semibold truncate", tempTo ? "text-foreground" : "text-muted-foreground/40")}>
                {tempTo
                  ? fmtShort(tempTo)
                  : hoverDay && picking === "to"
                  ? fmtShort(hoverDay)
                  : "Click an end date"}
              </p>
            </div>
          </div>

          {/* Hint */}
          <p className="text-center text-[10px] text-muted-foreground/50 mb-3">
            {picking === "from" ? "Select start date" : "Now select end date"}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2 px-3 pb-3">
            <button
              onClick={() => setShowCalendar(false)}
              className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyCustom}
              disabled={!tempFrom || !tempTo}
              className="flex-1 rounded-xl bg-[#3b82f6] py-2.5 text-xs font-bold text-white hover:bg-[#2563eb] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
