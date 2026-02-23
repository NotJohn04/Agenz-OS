"use client";

import { useState } from "react";
import { mockLeads } from "@/lib/mock-data";
import { LEAD_STAGE_CONFIG } from "@/lib/constants";
import { Search, Filter, Plus, Phone, Mail, User, ArrowUpDown, ChevronDown, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SortKey = "name" | "dealValue" | "daysInStage" | "stage";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("daysInStage");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = mockLeads
    .filter((l) => {
      const matchSearch = search === "" || l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase());
      const matchStage = filterStage === "all" || l.stage === filterStage;
      return matchSearch && matchStage;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "dealValue") cmp = a.dealValue - b.dealValue;
      else if (sortKey === "daysInStage") cmp = a.daysInStage - b.daysInStage;
      else if (sortKey === "stage") cmp = a.stage.localeCompare(b.stage);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const stages = Object.keys(LEAD_STAGE_CONFIG);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} contacts · {mockLeads.filter(l => l.daysInStage > 14 && l.stage !== "WON" && l.stage !== "LOST").length} need attention</p>
        </div>
        <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl gap-2 shadow-[0_0_16px_rgba(59,130,246,0.2)]">
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 rounded-xl" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl">
              <Filter className="h-3.5 w-3.5" />
              Stage <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStage("all")}>All Stages</DropdownMenuItem>
            {stages.map(s => (
              <DropdownMenuItem key={s} onClick={() => setFilterStage(s)}>
                {LEAD_STAGE_CONFIG[s as keyof typeof LEAD_STAGE_CONFIG].label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  { key: "name", label: "Contact" },
                  { key: "stage", label: "Stage" },
                  { key: "dealValue", label: "Deal Value" },
                  { key: "daysInStage", label: "Days in Stage" },
                  { label: "Source", key: null },
                  { label: "Agent", key: null },
                  { label: "Actions", key: null },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={cn("px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", col.key && "cursor-pointer hover:text-foreground")}
                    onClick={() => col.key && handleSort(col.key as SortKey)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.key && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const stageConf = LEAD_STAGE_CONFIG[lead.stage];
                const isStale = lead.daysInStage > 14 && lead.stage !== "WON" && lead.stage !== "LOST";
                const isCritical = lead.daysInStage > 30 && lead.stage !== "WON" && lead.stage !== "LOST";
                return (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    {/* Contact */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-[11px] font-bold text-[#3b82f6]">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xs">{lead.name}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.company}</p>
                        </div>
                      </div>
                    </td>
                    {/* Stage */}
                    <td className="px-4 py-3">
                      <Badge className={cn("text-[10px] font-semibold rounded-full px-2 py-0.5 border-0", stageConf.bgColor)}>
                        {stageConf.label}
                      </Badge>
                    </td>
                    {/* Deal Value */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-foreground text-xs">RM {lead.dealValue.toLocaleString()}</span>
                    </td>
                    {/* Days in stage */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {(isStale || isCritical) && (
                          <AlertTriangle className={cn("h-3.5 w-3.5", isCritical ? "text-red-400" : "text-orange-400")} />
                        )}
                        <span className={cn("text-xs font-medium",
                          isCritical ? "text-red-400" : isStale ? "text-orange-400" : "text-foreground"
                        )}>
                          {lead.daysInStage}d
                        </span>
                      </div>
                    </td>
                    {/* Source */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">{lead.source}</span>
                    </td>
                    {/* Agent */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-foreground">
                          {lead.assignedAgent.charAt(0)}
                        </div>
                        <span className="text-xs text-muted-foreground">{lead.assignedAgent}</span>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted transition-colors" title="Call">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground hover:text-[#3b82f6]" />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted transition-colors" title="Email">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground hover:text-[#3b82f6]" />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted transition-colors" title="Profile">
                          <User className="h-3.5 w-3.5 text-muted-foreground hover:text-[#3b82f6]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No contacts match your search.
          </div>
        )}
      </div>
    </div>
  );
}
