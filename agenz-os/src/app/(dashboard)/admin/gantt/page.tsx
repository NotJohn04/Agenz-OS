"use client";

import { mockGanttTasks } from "@/lib/mock-data";
import { MODULE_CONFIG } from "@/lib/constants";
import type { GanttTask } from "@/types";
import { CheckCircle2, AlertTriangle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  COMPLETED: { label: "Completed", color: "#10b981", bg: "bg-emerald-500/10 text-emerald-400", icon: CheckCircle2 },
  ON_TRACK: { label: "On Track", color: "#3b82f6", bg: "bg-blue-500/10 text-blue-400", icon: CheckCircle2 },
  AT_RISK: { label: "At Risk", color: "#f97316", bg: "bg-orange-500/10 text-orange-400", icon: AlertTriangle },
  DELAYED: { label: "Delayed", color: "#ef4444", bg: "bg-red-500/10 text-red-400", icon: XCircle },
};

function getDatePosition(dateStr: string, startDate: Date, totalDays: number): number {
  const date = new Date(dateStr);
  const diff = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.min(100, (diff / totalDays) * 100));
}

function GanttRow({ task, startDate, totalDays }: { task: GanttTask; startDate: Date; totalDays: number }) {
  const start = getDatePosition(task.startDate, startDate, totalDays);
  const end = getDatePosition(task.endDate, startDate, totalDays);
  const width = Math.max(end - start, 2);
  const config = statusConfig[task.status];
  const moduleConf = MODULE_CONFIG[task.module];
  const StatusIcon = config.icon;

  return (
    <div className="grid grid-cols-[220px_1fr] gap-0 border-b border-border/30 hover:bg-muted/20 transition-colors">
      {/* Label */}
      <div className="flex flex-col justify-center px-4 py-3 border-r border-border/30">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: config.color }} />
          <span className="text-xs font-semibold text-foreground truncate">{task.title}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{task.clientName}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${moduleConf.color}15`, color: moduleConf.color }}>
            {moduleConf.label}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="h-1 w-full max-w-[120px] rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${task.percentComplete}%`, backgroundColor: config.color }}
            />
          </div>
          <span className="text-[10px] font-semibold ml-2" style={{ color: config.color }}>
            {task.percentComplete}%
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="relative flex items-center px-2 py-3 bg-muted/5">
        <div className="relative h-7 w-full">
          <div
            className="absolute h-7 rounded-lg opacity-90 flex items-center px-2"
            style={{
              left: `${start}%`,
              width: `${width}%`,
              backgroundColor: `${config.color}20`,
              border: `1px solid ${config.color}40`,
            }}
          >
            {width > 10 && (
              <span className="text-[9px] font-semibold text-foreground truncate" style={{ color: config.color }}>
                {task.assignee}
              </span>
            )}
          </div>
          {/* Completion fill */}
          {task.percentComplete > 0 && (
            <div
              className="absolute h-7 rounded-lg opacity-80"
              style={{
                left: `${start}%`,
                width: `${(width * task.percentComplete) / 100}%`,
                backgroundColor: config.color,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function GanttPage() {
  const allDates = mockGanttTasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)]);
  const startDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  // Generate month labels
  const months: { label: string; position: number }[] = [];
  const cursor = new Date(startDate);
  cursor.setDate(1);
  while (cursor <= endDate) {
    const pos = getDatePosition(cursor.toISOString().split("T")[0], startDate, totalDays);
    months.push({
      label: cursor.toLocaleDateString("en-MY", { month: "short", year: "2-digit" }),
      position: pos,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const summary = {
    total: mockGanttTasks.length,
    completed: mockGanttTasks.filter(t => t.status === "COMPLETED").length,
    onTrack: mockGanttTasks.filter(t => t.status === "ON_TRACK").length,
    atRisk: mockGanttTasks.filter(t => t.status === "AT_RISK").length,
    delayed: mockGanttTasks.filter(t => t.status === "DELAYED").length,
  };

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Gantt Chart</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Project timeline · {mockGanttTasks.length} deliverables across {new Set(mockGanttTasks.map(t => t.clientId)).size} clients</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {Object.entries(statusConfig).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: v.color }} />
              <span className="text-muted-foreground">{v.label}: <strong className="text-foreground">{summary[k.toLowerCase() === "on_track" ? "onTrack" : k.toLowerCase() === "at_risk" ? "atRisk" : k.toLowerCase() as keyof typeof summary]}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Completed", value: summary.completed, color: "#10b981" },
          { label: "On Track", value: summary.onTrack, color: "#3b82f6" },
          { label: "At Risk", value: summary.atRisk, color: "#f97316" },
          { label: "Delayed", value: summary.delayed, color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gantt chart */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Month header */}
        <div className="grid grid-cols-[220px_1fr] border-b border-border bg-muted/20">
          <div className="px-4 py-2.5 border-r border-border">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Task / Client</span>
          </div>
          <div className="relative px-2 py-2.5">
            {months.map((m, i) => (
              <div
                key={i}
                className="absolute text-[10px] font-medium text-muted-foreground"
                style={{ left: `${m.position}%` }}
              >
                {m.label}
              </div>
            ))}
            {/* Today marker */}
            <div
              className="absolute top-0 bottom-0 w-px bg-[#3b82f6]/60"
              style={{ left: `${getDatePosition(new Date().toISOString().split("T")[0], startDate, totalDays)}%` }}
            >
              <div className="absolute -top-0.5 left-1 text-[9px] font-bold text-[#3b82f6]">Today</div>
            </div>
          </div>
        </div>

        {/* Rows */}
        {mockGanttTasks.map(task => (
          <GanttRow key={task.id} task={task} startDate={startDate} totalDays={totalDays} />
        ))}
      </div>
    </div>
  );
}
