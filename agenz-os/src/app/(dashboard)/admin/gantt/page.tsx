"use client";

import { useState } from "react";
import { mockGanttTasks, mockClients } from "@/lib/mock-data";
import { MODULE_CONFIG } from "@/lib/constants";
import type { GanttTask, ModuleType } from "@/types";
import {
  CheckCircle2, AlertTriangle, XCircle,
  Plus, Zap, Edit2, Trash2, X, Flag,
  Diamond, Calendar, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
type TaskStatus = GanttTask["status"];
type EventType = "MILESTONE" | "DEADLINE" | "REVIEW" | "PAYMENT";

interface GanttEvent {
  id: string;
  title: string;
  date: string;
  clientId: string;
  clientName: string;
  type: EventType;
}

// ─── Config ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  COMPLETED: { label: "Completed", color: "#10b981", icon: CheckCircle2 },
  ON_TRACK:  { label: "On Track",  color: "#3b82f6", icon: CheckCircle2 },
  AT_RISK:   { label: "At Risk",   color: "#f97316", icon: AlertTriangle },
  DELAYED:   { label: "Delayed",   color: "#ef4444", icon: XCircle },
};

const EVENT_CONFIG: Record<EventType, { label: string; color: string }> = {
  MILESTONE: { label: "Milestone", color: "#8b5cf6" },
  DEADLINE:  { label: "Deadline",  color: "#ef4444" },
  REVIEW:    { label: "Review",    color: "#3b82f6" },
  PAYMENT:   { label: "Payment",   color: "#10b981" },
};

const MODULES = Object.keys(MODULE_CONFIG) as ModuleType[];
const ASSIGNEES = ["Hakim", "Syafiq", "Rina", "Amir", "Self"];
const STATUSES: TaskStatus[] = ["ON_TRACK", "AT_RISK", "DELAYED", "COMPLETED"];
const EVENT_TYPES: EventType[] = ["MILESTONE", "DEADLINE", "REVIEW", "PAYMENT"];

// ─── Auto-generate templates ──────────────────────────────────────────────────
function autoGenerateTasks(existingTasks: GanttTask[]): GanttTask[] {
  const existingIds = new Set(existingTasks.map((t) => t.id));
  const activeClients = mockClients.filter((c) => c.packageTier !== "NONE" && c.joinedAt);
  const newTasks: GanttTask[] = [];

  const templates: Array<{ suffix: string; offsetStart: number; offsetEnd: number; module: ModuleType; status: (daysAgo: number) => TaskStatus; pct: (daysAgo: number) => number; assignee: string }> = [
    { suffix: "kickoff",  offsetStart: 0,  offsetEnd: 7,  module: "ADS_PERFORMANCE",    status: (d) => d > 7  ? "COMPLETED" : "ON_TRACK", pct: (d) => d > 7  ? 100 : 60, assignee: "Hakim" },
    { suffix: "baseline", offsetStart: 7,  offsetEnd: 14, module: "ADS_PERFORMANCE",    status: (d) => d > 14 ? "COMPLETED" : "ON_TRACK", pct: (d) => d > 14 ? 100 : 40, assignee: "Syafiq" },
    { suffix: "setup",    offsetStart: 14, offsetEnd: 28, module: "SALES_OPTIMIZATION", status: (d) => d > 28 ? "COMPLETED" : d > 18 ? "ON_TRACK" : "AT_RISK", pct: (d) => d > 28 ? 100 : Math.min(90, Math.round((d / 28) * 100)), assignee: "Rina" },
    { suffix: "launch",   offsetStart: 28, offsetEnd: 56, module: "ADS_PERFORMANCE",    status: (d) => d > 56 ? "COMPLETED" : "ON_TRACK", pct: (d) => d > 56 ? 100 : Math.min(80, Math.round(((d - 28) / 28) * 100)), assignee: "Hakim" },
    { suffix: "review1",  offsetStart: 30, offsetEnd: 33, module: "SALES_OPTIMIZATION", status: (d) => d > 33 ? "COMPLETED" : "ON_TRACK", pct: (d) => d > 33 ? 100 : 0, assignee: "Hakim" },
    { suffix: "optim",    offsetStart: 56, offsetEnd: 90, module: "ADS_PERFORMANCE",    status: (d) => d > 90 ? "COMPLETED" : "ON_TRACK", pct: (d) => d > 90 ? 100 : Math.max(0, Math.round(((d - 56) / 34) * 100)), assignee: "Syafiq" },
  ];

  const TEMPLATE_TITLES: Record<string, string> = {
    kickoff:  "Kickoff & Onboarding",
    baseline: "Strategy & Baseline Setup",
    setup:    "Platform Setup & Integration",
    launch:   "Campaign Launch",
    review1:  "Month 1 Review",
    optim:    "Ongoing Optimisation",
  };

  for (const client of activeClients) {
    const joinDate = new Date(client.joinedAt!);
    const today = new Date();
    const daysAgo = Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

    for (const tmpl of templates) {
      const taskId = `auto-${client.id}-${tmpl.suffix}`;
      if (existingIds.has(taskId)) continue;

      const start = new Date(joinDate);
      start.setDate(start.getDate() + tmpl.offsetStart);
      const end = new Date(joinDate);
      end.setDate(end.getDate() + tmpl.offsetEnd);

      newTasks.push({
        id: taskId,
        clientId: client.id,
        clientName: client.businessName ?? client.name,
        title: TEMPLATE_TITLES[tmpl.suffix],
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
        module: client.activeModules[0] ?? tmpl.module,
        status: tmpl.status(daysAgo),
        percentComplete: tmpl.pct(daysAgo),
        assignee: tmpl.assignee,
      });
    }
  }
  return newTasks;
}

function autoGenerateEvents(existingEvents: GanttEvent[]): GanttEvent[] {
  const existingIds = new Set(existingEvents.map((e) => e.id));
  const activeClients = mockClients.filter((c) => c.packageTier !== "NONE" && c.joinedAt);
  const newEvents: GanttEvent[] = [];

  for (const client of activeClients) {
    const joinDate = new Date(client.joinedAt!);

    const evts: Array<{ suffix: string; offset: number; title: string; type: EventType }> = [
      { suffix: "contract", offset: 0,  title: "Contract Signed",  type: "MILESTONE" },
      { suffix: "payment",  offset: 3,  title: "First Payment",    type: "PAYMENT" },
      { suffix: "golive",   offset: 28, title: "Campaign Go Live",  type: "MILESTONE" },
      { suffix: "review",   offset: 30, title: "Month 1 Review",    type: "REVIEW" },
      { suffix: "review2",  offset: 60, title: "Month 2 Review",    type: "REVIEW" },
    ];

    for (const evt of evts) {
      const id = `evt-${client.id}-${evt.suffix}`;
      if (existingIds.has(id)) continue;
      const d = new Date(joinDate);
      d.setDate(d.getDate() + evt.offset);
      newEvents.push({
        id,
        clientId: client.id,
        clientName: client.businessName ?? client.name,
        title: evt.title,
        date: d.toISOString().split("T")[0],
        type: evt.type,
      });
    }
  }
  return newEvents;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function datePos(dateStr: string, start: Date, totalDays: number) {
  const d = new Date(dateStr);
  const diff = (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.min(100, (diff / totalDays) * 100));
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-MY", { day: "numeric", month: "short" });
}

// ─── Task modal ───────────────────────────────────────────────────────────────
interface TaskFormData {
  title: string; clientId: string; module: ModuleType;
  assignee: string; startDate: string; endDate: string;
  status: TaskStatus; percentComplete: number;
}

function TaskModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<TaskFormData & { id: string }>;
  onSave: (data: TaskFormData & { id?: string }) => void;
  onClose: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0];

  const [form, setForm] = useState<TaskFormData>({
    title: initial?.title ?? "",
    clientId: initial?.clientId ?? mockClients[0].id,
    module: initial?.module ?? "ADS_PERFORMANCE",
    assignee: initial?.assignee ?? "Hakim",
    startDate: initial?.startDate ?? today,
    endDate: initial?.endDate ?? nextWeek,
    status: initial?.status ?? "ON_TRACK",
    percentComplete: initial?.percentComplete ?? 0,
  });

  const set = (k: keyof TaskFormData, v: unknown) => setForm((p) => ({ ...p, [k]: v }));
  const client = mockClients.find((c) => c.id === form.clientId)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-background shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{initial?.id ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Task Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Campaign Setup & Audit"
              className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
            />
          </div>

          {/* Client + Module */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Client *</label>
              <select
                value={form.clientId}
                onChange={(e) => set("clientId", e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              >
                {mockClients.filter((c) => c.packageTier !== "NONE").map((c) => (
                  <option key={c.id} value={c.id}>{c.businessName ?? c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Module</label>
              <select
                value={form.module}
                onChange={(e) => set("module", e.target.value as ModuleType)}
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              >
                {MODULES.map((m) => <option key={m} value={m}>{MODULE_CONFIG[m].label}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">End Date *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              />
            </div>
          </div>

          {/* Assignee + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Assignee</label>
              <select
                value={form.assignee}
                onChange={(e) => set("assignee", e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              >
                {ASSIGNEES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as TaskStatus)}
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
              </select>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-semibold text-foreground">Progress</label>
              <span className="text-xs font-bold text-[#3b82f6]">{form.percentComplete}%</span>
            </div>
            <input
              type="range"
              min={0} max={100}
              value={form.percentComplete}
              onChange={(e) => set("percentComplete", Number(e.target.value))}
              className="w-full accent-[#3b82f6]"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.title || !form.startDate || !form.endDate) return;
              const client = mockClients.find((c) => c.id === form.clientId)!;
              onSave({ ...form, id: initial?.id, clientId: form.clientId });
              onClose();
            }}
            disabled={!form.title || !form.startDate || !form.endDate}
            className="flex-1 rounded-xl bg-[#3b82f6] py-2.5 text-sm font-bold text-white hover:bg-[#3b82f6]/90 disabled:opacity-40 transition-colors"
          >
            {initial?.id ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Event modal ──────────────────────────────────────────────────────────────
function EventModal({
  onSave,
  onClose,
}: {
  onSave: (e: GanttEvent) => void;
  onClose: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ title: "", clientId: mockClients[0].id, date: today, type: "MILESTONE" as EventType });
  const set = (k: keyof typeof form, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-background shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">New Event / Milestone</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Event Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Campaign Go Live"
              className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Client</label>
            <select
              value={form.clientId}
              onChange={(e) => set("clientId", e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
            >
              {mockClients.filter((c) => c.packageTier !== "NONE").map((c) => (
                <option key={c.id} value={c.id}>{c.businessName ?? c.name}</option>
              ))}
              <option value="agency">Agency (Internal)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value as EventType)}
                className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              >
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{EVENT_CONFIG[t].label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.title || !form.date) return;
              const client = mockClients.find((c) => c.id === form.clientId);
              onSave({
                id: `evt-${Date.now()}`,
                title: form.title,
                date: form.date,
                clientId: form.clientId,
                clientName: client ? (client.businessName ?? client.name) : "Agency",
                type: form.type,
              });
              onClose();
            }}
            disabled={!form.title || !form.date}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-40 transition-colors"
            style={{ backgroundColor: EVENT_CONFIG[form.type].color }}
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Gantt Task Row ───────────────────────────────────────────────────────────
function GanttRow({
  task, startDate, totalDays, onEdit, onDelete,
}: {
  task: GanttTask; startDate: Date; totalDays: number;
  onEdit: () => void; onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const start = datePos(task.startDate, startDate, totalDays);
  const end = datePos(task.endDate, startDate, totalDays);
  const width = Math.max(end - start, 2);
  const cfg = STATUS_CONFIG[task.status];
  const mod = MODULE_CONFIG[task.module];
  const Icon = cfg.icon;

  return (
    <div
      className="grid grid-cols-[240px_1fr] gap-0 border-b border-border/30 hover:bg-muted/20 transition-colors group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Label */}
      <div className="flex items-center justify-between px-4 py-3 border-r border-border/30">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: cfg.color }} />
            <span className="text-xs font-semibold text-foreground truncate">{task.title}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground truncate">{task.clientName}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
              {mod.label}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 max-w-[100px] rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${task.percentComplete}%`, backgroundColor: cfg.color }} />
            </div>
            <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{task.percentComplete}%</span>
          </div>
        </div>
        {/* Edit/delete on hover */}
        {hovered && (
          <div className="flex gap-1 ml-2 flex-shrink-0">
            <button onClick={onEdit} className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Edit2 className="h-3 w-3" />
            </button>
            <button onClick={onDelete} className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-red-400 transition-colors">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Bar */}
      <div className="relative flex items-center px-2 py-3 bg-muted/5">
        <div className="relative h-7 w-full">
          {/* Background bar */}
          <div
            className="absolute h-7 rounded-lg flex items-center px-2"
            style={{ left: `${start}%`, width: `${width}%`, backgroundColor: `${cfg.color}20`, border: `1px solid ${cfg.color}40` }}
          >
            {width > 12 && <span className="text-[9px] font-semibold truncate" style={{ color: cfg.color }}>{task.assignee}</span>}
          </div>
          {/* Progress fill */}
          {task.percentComplete > 0 && (
            <div
              className="absolute h-7 rounded-lg"
              style={{ left: `${start}%`, width: `${(width * task.percentComplete) / 100}%`, backgroundColor: cfg.color, opacity: 0.75 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Event Row ────────────────────────────────────────────────────────────────
function EventRow({
  event, startDate, totalDays, onDelete,
}: {
  event: GanttEvent; startDate: Date; totalDays: number; onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = datePos(event.date, startDate, totalDays);
  const cfg = EVENT_CONFIG[event.type];

  return (
    <div
      className="grid grid-cols-[240px_1fr] gap-0 border-b border-border/20 hover:bg-muted/10 transition-colors group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-r border-border/20">
        <div className="flex items-center gap-2 min-w-0">
          <Diamond className="h-3 w-3 flex-shrink-0" style={{ fill: cfg.color, color: cfg.color }} />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-foreground truncate">{event.title}</p>
            <p className="text-[9px] text-muted-foreground">{event.clientName} · {fmt(event.date)}</p>
          </div>
        </div>
        {hovered && (
          <button onClick={onDelete} className="flex h-5 w-5 items-center justify-center rounded-md bg-muted text-muted-foreground hover:text-red-400 ml-1 flex-shrink-0">
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </div>
      <div className="relative flex items-center px-2 py-2.5 bg-muted/5">
        <div className="relative h-5 w-full">
          {pos >= 0 && pos <= 100 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${pos}%` }}
            >
              {/* Diamond shape */}
              <div
                className="h-3.5 w-3.5 rotate-45 rounded-sm"
                style={{ backgroundColor: cfg.color }}
                title={`${event.title} · ${fmt(event.date)}`}
              />
              {/* Vertical line */}
              <div className="w-px h-4" style={{ backgroundColor: `${cfg.color}40` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-background px-4 py-3 shadow-xl">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
      </div>
      <p className="text-sm font-semibold text-foreground">{message}</p>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-2">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GanttPage() {
  const [tasks, setTasks] = useState<GanttTask[]>(mockGanttTasks);
  const [events, setEvents] = useState<GanttEvent[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingTask, setEditingTask] = useState<GanttTask | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterClient, setFilterClient] = useState<string>("all");

  // Compute date range across tasks + events
  const taskDates = tasks.flatMap((t) => [new Date(t.startDate), new Date(t.endDate)]);
  const eventDates = events.map((e) => new Date(e.date));
  const allDates = [...taskDates, ...eventDates, new Date()];
  const startDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  // Pad by 7 days on each side
  startDate.setDate(startDate.getDate() - 7);
  endDate.setDate(endDate.getDate() + 14);
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  // Month labels
  const months: { label: string; position: number }[] = [];
  const cursor = new Date(startDate);
  cursor.setDate(1);
  while (cursor <= endDate) {
    months.push({
      label: cursor.toLocaleDateString("en-MY", { month: "short", year: "2-digit" }),
      position: datePos(cursor.toISOString().split("T")[0], startDate, totalDays),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const handleAutoGenerate = () => {
    const newTasks = autoGenerateTasks(tasks);
    const newEvents = autoGenerateEvents(events);
    setTasks((prev) => [...prev, ...newTasks]);
    setEvents((prev) => [...prev, ...newEvents]);
    const count = newTasks.length + newEvents.length;
    setToast(`Auto-generated ${newTasks.length} tasks and ${newEvents.length} events`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveTask = (data: Partial<GanttTask> & { clientId: string }) => {
    const client = mockClients.find((c) => c.id === data.clientId)!;
    if (editingTask) {
      setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...data, clientName: client.businessName ?? client.name } : t));
    } else {
      setTasks((prev) => [...prev, { ...data, id: `task-${Date.now()}`, clientName: client.businessName ?? client.name } as GanttTask]);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const handleDeleteEvent = (id: string) => setEvents((prev) => prev.filter((e) => e.id !== id));

  const activeClients = [
    { id: "all", label: "All Clients" },
    ...mockClients.filter((c) => c.packageTier !== "NONE").map((c) => ({
      id: c.id,
      label: c.businessName ?? c.name,
    })),
  ];

  const filteredTasks = filterClient === "all" ? tasks : tasks.filter((t) => t.clientId === filterClient);
  const filteredEvents = filterClient === "all" ? events : events.filter((e) => e.clientId === filterClient);

  const summary = {
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    onTrack: tasks.filter((t) => t.status === "ON_TRACK").length,
    atRisk: tasks.filter((t) => t.status === "AT_RISK").length,
    delayed: tasks.filter((t) => t.status === "DELAYED").length,
  };

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Gantt Chart</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tasks.length} tasks · {events.length} events across {new Set(tasks.map((t) => t.clientId)).size} clients
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Client filter */}
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
          >
            {activeClients.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>

          {/* Auto-generate */}
          <button
            onClick={handleAutoGenerate}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
          >
            <Zap className="h-3.5 w-3.5" />
            Auto-Generate
          </button>

          {/* New event */}
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Diamond className="h-3.5 w-3.5" />
            New Event
          </button>

          {/* New task */}
          <button
            onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
            className="flex items-center gap-1.5 rounded-xl bg-[#3b82f6] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#3b82f6]/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Completed", value: summary.completed, color: "#10b981" },
          { label: "On Track",  value: summary.onTrack,   color: "#3b82f6" },
          { label: "At Risk",   value: summary.atRisk,    color: "#f97316" },
          { label: "Delayed",   value: summary.delayed,   color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3.5 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        {/* Timeline header */}
        <div className="grid grid-cols-[240px_1fr] border-b border-border bg-muted/20 min-w-[700px]">
          <div className="px-4 py-2.5 border-r border-border">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Task / Client</span>
          </div>
          <div className="relative px-2 py-2.5" style={{ minWidth: 400 }}>
            {months.map((m, i) => (
              <div key={i} className="absolute text-[10px] font-medium text-muted-foreground" style={{ left: `${m.position}%` }}>
                {m.label}
              </div>
            ))}
            {/* Today marker */}
            <div
              className="absolute top-0 bottom-0 w-px bg-[#3b82f6]/60"
              style={{ left: `${datePos(new Date().toISOString().split("T")[0], startDate, totalDays)}%` }}
            >
              <div className="absolute -top-0.5 left-1 text-[9px] font-bold text-[#3b82f6]">Today</div>
            </div>
          </div>
        </div>

        {/* Events section */}
        {filteredEvents.length > 0 && (
          <>
            <div className="grid grid-cols-[240px_1fr] border-b border-border/50 bg-muted/10 min-w-[700px]">
              <div className="px-4 py-1.5 border-r border-border/50">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Milestones & Events</span>
              </div>
              <div className="py-1.5" />
            </div>
            {filteredEvents.map((evt) => (
              <EventRow key={evt.id} event={evt} startDate={startDate} totalDays={totalDays} onDelete={() => handleDeleteEvent(evt.id)} />
            ))}
          </>
        )}

        {/* Tasks section */}
        {filteredTasks.length > 0 && (
          <>
            <div className="grid grid-cols-[240px_1fr] border-b border-border/50 bg-muted/10 min-w-[700px]">
              <div className="px-4 py-1.5 border-r border-border/50">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Tasks & Deliverables</span>
              </div>
              <div className="py-1.5" />
            </div>
            {filteredTasks.map((task) => (
              <GanttRow
                key={task.id}
                task={task}
                startDate={startDate}
                totalDays={totalDays}
                onEdit={() => { setEditingTask(task); setShowTaskModal(true); }}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </>
        )}

        {filteredTasks.length === 0 && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">No tasks yet</p>
            <p className="text-xs text-muted-foreground">Click <strong>Auto-Generate</strong> to create tasks from client data, or <strong>New Task</strong> to add manually.</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex flex-wrap gap-4">
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: v.color }} />
              <span className="text-[11px] text-muted-foreground">{v.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 border-l border-border pl-5">
          {Object.entries(EVENT_CONFIG).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rotate-45 rounded-sm" style={{ backgroundColor: v.color }} />
              <span className="text-[11px] text-muted-foreground">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {(showTaskModal || editingTask) && (
        <TaskModal
          initial={editingTask ?? undefined}
          onSave={handleSaveTask}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        />
      )}
      {showEventModal && (
        <EventModal
          onSave={(e) => { setEvents((prev) => [...prev, e]); setShowEventModal(false); }}
          onClose={() => setShowEventModal(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
