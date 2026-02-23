"use client";

import { mockClients } from "@/lib/mock-data";
import { HEALTH_STATUS_CONFIG, PACKAGE_CONFIG, MODULE_CONFIG } from "@/lib/constants";
import { Search, Filter, ArrowUpCircle, AlertTriangle, CheckCircle2, ChevronDown, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const { setViewingAs } = useAuth();
  const router = useRouter();

  const filtered = mockClients.filter(c =>
    search === "" ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Client Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{mockClients.length} total accounts · {mockClients.filter(c => c.healthStatus === "CRITICAL").length} critical</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/upgrade">
            <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl gap-2 h-9 text-xs shadow-[0_0_16px_rgba(59,130,246,0.2)]">
              <ArrowUpCircle className="h-3.5 w-3.5" /> Upgrade Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 rounded-xl" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl">
              <Filter className="h-3.5 w-3.5" /> Status <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Clients</DropdownMenuItem>
            <DropdownMenuItem>Critical</DropdownMenuItem>
            <DropdownMenuItem>Warning</DropdownMenuItem>
            <DropdownMenuItem>Good</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Client cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map(client => {
          const healthConf = HEALTH_STATUS_CONFIG[client.healthStatus];
          const pkgConf = PACKAGE_CONFIG[client.packageTier];
          return (
            <div key={client.id} className={cn("rounded-2xl border bg-card p-5 transition-all hover:shadow-md",
              client.healthStatus === "CRITICAL" ? "border-red-500/20" :
              client.healthStatus === "WARNING" ? "border-orange-500/15" : "border-border"
            )}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                      {client.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                      client.healthStatus === "EXCELLENT" || client.healthStatus === "GOOD" ? "bg-emerald-400" :
                      client.healthStatus === "WARNING" ? "bg-orange-400" : "bg-red-400"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.businessName}</p>
                    <p className="text-[10px] text-muted-foreground/60">{client.industry} · {client.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={cn("text-[10px]", healthConf.bgClass)}>{healthConf.label}</Badge>
                  <span className="text-xs font-semibold" style={{ color: pkgConf.color }}>{pkgConf.label}</span>
                </div>
              </div>

              {/* Health score */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Health Score</span>
                  <span className="font-bold" style={{ color: healthConf.color }}>{client.healthScore}/100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${client.healthScore}%`, backgroundColor: healthConf.color }} />
                </div>
              </div>

              {/* Active modules */}
              {client.activeModules.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {client.activeModules.map(m => (
                    <span key={m} className="rounded-full px-2 py-0.5 text-[9px] font-semibold border" style={{ color: MODULE_CONFIG[m].color, borderColor: `${MODULE_CONFIG[m].color}30`, backgroundColor: `${MODULE_CONFIG[m].color}10` }}>
                      {MODULE_CONFIG[m].label}
                    </span>
                  ))}
                </div>
              )}

              {/* Status flags */}
              <div className="flex items-center gap-3 text-[10px] mb-4">
                <div className={cn("flex items-center gap-1", client.contractSigned ? "text-emerald-400" : "text-muted-foreground/40")}>
                  {client.contractSigned ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/40" />}
                  Contract
                </div>
                <div className={cn("flex items-center gap-1", client.paymentConfirmed ? "text-emerald-400" : "text-muted-foreground/40")}>
                  {client.paymentConfirmed ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/40" />}
                  Payment
                </div>
                <div className={cn("flex items-center gap-1", client.baselineCaptured ? "text-emerald-400" : "text-muted-foreground/40")}>
                  {client.baselineCaptured ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/40" />}
                  Baseline
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setViewingAs(client);
                    router.push("/dashboard");
                  }}
                  className="flex-1 rounded-xl h-8 text-xs gap-1.5 bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/20"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View as Client
                </Button>
                <Link href="/admin/upgrade" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full rounded-xl h-8 text-xs gap-1.5">
                    <ArrowUpCircle className="h-3.5 w-3.5" />
                    Manage
                  </Button>
                </Link>
                {client.healthStatus === "CRITICAL" && (
                  <Button size="sm" className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl h-8 text-xs gap-1.5 px-3">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
