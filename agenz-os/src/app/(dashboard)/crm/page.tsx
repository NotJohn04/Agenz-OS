"use client";

import { useState } from "react";
import { mockLeads } from "@/lib/mock-data";
import { LEAD_STAGE_CONFIG } from "@/lib/constants";
import type { Lead, LeadStage } from "@/types";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Filter,
  Plus,
  Search,
  User,
  TrendingUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
  useDraggable,
  closestCenter,
} from "@dnd-kit/core";
import { ContactPanel } from "@/components/crm/contact-panel";

const STAGE_ORDER: LeadStage[] = [
  "NEW_LEAD",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
];

// ─── Lead card (display only — used in both board and DragOverlay) ────────────
function LeadCardDisplay({
  lead,
  dimmed = false,
}: {
  lead: Lead;
  dimmed?: boolean;
}) {
  const isStale = lead.daysInStage > 14;
  const isCritical = lead.daysInStage > 30;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-3.5 transition-all duration-150",
        isCritical
          ? "border-red-500/25 bg-red-500/5"
          : isStale
          ? "border-orange-500/20"
          : "border-border",
        dimmed && "opacity-40"
      )}
    >
      {(isStale || isCritical) && (
        <div
          className={cn(
            "mb-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-semibold",
            isCritical
              ? "bg-red-500/10 text-red-400"
              : "bg-orange-500/10 text-orange-400"
          )}
        >
          <AlertTriangle className="h-3 w-3" />
          {isCritical
            ? `STALE — ${lead.daysInStage} days`
            : `${lead.daysInStage} days in stage`}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-[10px] font-bold text-[#3b82f6]">
            {lead.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{lead.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{lead.company}</p>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-bold text-foreground">
          <DollarSign className="h-3 w-3 text-emerald-400" />
          RM {(lead.dealValue / 1000).toFixed(0)}K
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          {lead.daysInStage}d
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2">
        <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold bg-[#3b82f6]/10 text-[#3b82f6]">
          {lead.source}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <User className="h-2.5 w-2.5" />
          {lead.assignedAgent}
        </div>
      </div>
    </div>
  );
}

// ─── Draggable lead card (with grip handle + click to open panel) ─────────────
function DraggableLeadCard({
  lead,
  activeId,
  onOpen,
}: {
  lead: Lead;
  activeId: string | null;
  onOpen: () => void;
}) {
  // When using DragOverlay, do NOT apply transform to original —
  // DragOverlay renders the floating copy. Original just fades out.
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const isDragging = activeId === lead.id;

  const isStale = lead.daysInStage > 14;
  const isCritical = lead.daysInStage > 30;

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0 : 1, transition: "opacity 150ms" }}
      className={cn(
        "group rounded-xl border bg-card transition-all duration-150 hover:shadow-md",
        isCritical
          ? "border-red-500/25 bg-red-500/5"
          : isStale
          ? "border-orange-500/20"
          : "border-border",
        isDragging && "opacity-30 cursor-grabbing"
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-1 px-3 pt-3 pb-1 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/80 transition-colors" />
        <span className="text-[9px] text-muted-foreground/40 group-hover:text-muted-foreground/60 uppercase tracking-wider">
          drag
        </span>
      </div>

      {/* Clickable content */}
      <div
        className="px-3 pb-3 cursor-pointer"
        onClick={onOpen}
      >
        {(isStale || isCritical) && (
          <div
            className={cn(
              "mb-2 flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-semibold",
              isCritical
                ? "bg-red-500/10 text-red-400"
                : "bg-orange-500/10 text-orange-400"
            )}
          >
            <AlertTriangle className="h-3 w-3" />
            {isCritical
              ? `STALE — ${lead.daysInStage} days`
              : `${lead.daysInStage} days in stage`}
          </div>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-[10px] font-bold text-[#3b82f6]">
            {lead.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{lead.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{lead.company}</p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-bold text-foreground">
            <DollarSign className="h-3 w-3 text-emerald-400" />
            RM {(lead.dealValue / 1000).toFixed(0)}K
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {lead.daysInStage}d
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2">
          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold bg-[#3b82f6]/10 text-[#3b82f6]">
            {lead.source}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <User className="h-2.5 w-2.5" />
            {lead.assignedAgent}
          </div>
        </div>

        <p className="mt-2 text-[10px] text-[#3b82f6]/70 text-right">
          Click to view details →
        </p>
      </div>
    </div>
  );
}

// ─── Droppable column ─────────────────────────────────────────────────────────
function PipelineColumn({
  stage,
  leads,
  activeId,
  onOpenLead,
}: {
  stage: LeadStage;
  leads: Lead[];
  activeId: string | null;
  onOpenLead: (lead: Lead) => void;
}) {
  const config = LEAD_STAGE_CONFIG[stage];
  const staleCount = leads.filter((l) => l.daysInStage > 14).length;
  const totalValue = leads.reduce((s, l) => s + l.dealValue, 0);

  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div className="flex w-[272px] flex-shrink-0 flex-col rounded-2xl border border-border bg-muted/30 transition-all duration-150">
      {/* Column header */}
      <div className="flex items-center justify-between rounded-t-2xl border-b border-border px-3.5 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
          <span className="text-xs font-semibold text-foreground">{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {staleCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-bold text-orange-400">
              <AlertTriangle className="h-2.5 w-2.5" />
              {staleCount}
            </span>
          )}
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
            {leads.length}
          </span>
        </div>
      </div>

      {/* Total value */}
      <div className="px-3.5 py-2 border-b border-border">
        <p className="text-[10px] text-muted-foreground">
          Total:{" "}
          <span className="font-semibold text-foreground">
            RM {(totalValue / 1000).toFixed(0)}K
          </span>
        </p>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2.5 overflow-y-auto p-3 min-h-[400px] rounded-b-2xl transition-all duration-150",
          isOver && "bg-[#3b82f6]/5 ring-2 ring-inset ring-[#3b82f6]/20"
        )}
      >
        {leads.map((lead) => (
          <DraggableLeadCard
            key={lead.id}
            lead={lead}
            activeId={activeId}
            onOpen={() => onOpenLead(lead)}
          />
        ))}
        {leads.length === 0 && (
          <div
            className={cn(
              "flex h-24 items-center justify-center rounded-xl border border-dashed transition-colors",
              isOver ? "border-[#3b82f6]/40 bg-[#3b82f6]/5" : "border-border"
            )}
          >
            <p className="text-[11px] text-muted-foreground/50">
              {isOver ? "Drop here" : "No leads"}
            </p>
          </div>
        )}

        {/* Add lead button */}
        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Add lead
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelLead, setPanelLead] = useState<Lead | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const sources = Array.from(new Set(leads.map((l) => l.source)));

  const filteredLeads = leads.filter((l) => {
    const matchSearch =
      search === "" ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase());
    const matchSource = filterSource === "all" || l.source === filterSource;
    return matchSearch && matchSource;
  });

  const activeLead = leads.find((l) => l.id === activeId) ?? null;

  const totalPipelineValue = leads.reduce((s, l) => s + l.dealValue, 0);
  const wonValue = leads
    .filter((l) => l.stage === "WON")
    .reduce((s, l) => s + l.dealValue, 0);
  const staleLeads = leads.filter(
    (l) => l.daysInStage > 14 && l.stage !== "WON" && l.stage !== "LOST"
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as LeadStage;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, stage: newStage, daysInStage: newStage !== l.stage ? 0 : l.daysInStage }
          : l
      )
    );
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function openPanel(lead: Lead) {
    setPanelLead(lead);
    setPanelOpen(true);
  }

  return (
    <div className="flex flex-col gap-5 max-w-full">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Pipeline</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {leads.filter((l) => l.stage !== "LOST").length} active leads ·{" "}
            <span className="text-[#3b82f6] font-medium">
              RM {(totalPipelineValue / 1000).toFixed(0)}K pipeline
            </span>
            {staleLeads.length > 0 && (
              <span className="ml-2 text-orange-400 font-medium">
                · {staleLeads.length} stale
              </span>
            )}
          </p>
        </div>
        <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl gap-2 shadow-[0_0_16px_rgba(59,130,246,0.2)]">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Total Leads",
            value: leads.filter((l) => l.stage !== "LOST").length,
            color: "#3b82f6",
          },
          {
            label: "Pipeline Value",
            value: `RM ${(totalPipelineValue / 1000).toFixed(0)}K`,
            color: "#06b6d4",
          },
          {
            label: "Won This Month",
            value: `RM ${(wonValue / 1000).toFixed(0)}K`,
            color: "#10b981",
          },
          {
            label: "Stale Leads",
            value: staleLeads.length,
            color: staleLeads.length > 0 ? "#f97316" : "#10b981",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3"
          >
            <div
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: stat.color }}
            />
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl border-border bg-card text-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl">
              <Filter className="h-3.5 w-3.5" />
              {filterSource === "all" ? "All Sources" : filterSource}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterSource("all")}>
              All Sources
            </DropdownMenuItem>
            {sources.map((s) => (
              <DropdownMenuItem key={s} onClick={() => setFilterSource(s)}>
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl">
          <TrendingUp className="h-3.5 w-3.5" />
          Analytics
        </Button>
      </div>

      {/* Drag instructions */}
      <p className="text-[11px] text-muted-foreground/60">
        Drag the grip handle <span className="font-mono">⠿</span> to move a lead between stages · Click a card to view details
      </p>

      {/* Kanban board with DnD */}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STAGE_ORDER.map((stage) => (
              <PipelineColumn
                key={stage}
                stage={stage}
                leads={filteredLeads.filter((l) => l.stage === stage)}
                activeId={activeId}
                onOpenLead={openPanel}
              />
            ))}
          </div>
        </div>

        {/* Floating drag overlay */}
        <DragOverlay dropAnimation={null}>
          {activeLead ? (
            <div className="rotate-2 shadow-2xl shadow-black/40">
              <LeadCardDisplay lead={activeLead} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Contact panel slide-out */}
      <ContactPanel
        lead={panelLead}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  );
}
