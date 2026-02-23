"use client";

import { useState } from "react";
import type { LucideProps } from "lucide-react";
import { mockClients } from "@/lib/mock-data";
import { PACKAGE_CONFIG, MODULE_CONFIG, CONSTRAINT_CONFIG } from "@/lib/constants";
import type { PackageTier, ModuleType, ConstraintType } from "@/types";
import {
  AlertTriangle, CheckCircle2, ChevronRight, Zap, Target,
  TrendingUp, Sparkles, Bot, Phone, Globe, Settings2, FileText, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DiagnosticResult {
  constraint: ConstraintType;
  evidence: string;
  rmLoss: number;
  recommendation: PackageTier;
  modules: ModuleType[];
}

const clientDiagnostics: Record<string, DiagnosticResult[]> = {
  c1: [
    {
      constraint: "CPL_TOO_HIGH",
      evidence: "CPL RM 34 vs benchmark RM 10–20",
      rmLoss: 18000,
      recommendation: "BEGINNER",
      modules: ["ADS_PERFORMANCE"],
    },
    {
      constraint: "CONVERSION_TOO_LOW",
      evidence: "Close rate 12% vs benchmark 20–35%",
      rmLoss: 12000,
      recommendation: "INTERMEDIATE",
      modules: ["ADS_PERFORMANCE", "SALES_OPTIMIZATION"],
    },
  ],
  c2: [
    {
      constraint: "CONVERSION_TOO_LOW",
      evidence: "Close rate 18% vs benchmark 25–45%",
      rmLoss: 8000,
      recommendation: "INTERMEDIATE",
      modules: ["ADS_PERFORMANCE", "SALES_OPTIMIZATION"],
    },
  ],
  c6: [
    {
      constraint: "INSUFFICIENT_LEADS",
      evidence: "12 leads/month vs benchmark 40–80",
      rmLoss: 22000,
      recommendation: "BEGINNER",
      modules: ["ADS_PERFORMANCE"],
    },
  ],
};

const packageOptions: PackageTier[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const addonOptions: PackageTier[] = ["AI_CHATBOT", "AI_CALLER", "WEBSITE", "AUTOMATION"];

const moduleIcons: Record<string, React.ComponentType<LucideProps>> = {
  ADS_PERFORMANCE: Target,
  SALES_OPTIMIZATION: TrendingUp,
  INFLUENCER_MARKETING: Sparkles,
  CONTENT_CREATION: FileText,
  AI_CHATBOT: Bot,
  AI_CALLER: Phone,
  WEBSITE: Globe,
  AUTOMATION: Settings2,
};

export default function UpgradeFlowPage() {
  const [selectedClient, setSelectedClient] = useState("c1");
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>("BEGINNER");
  const [selectedAddons, setSelectedAddons] = useState<PackageTier[]>([]);
  const [step, setStep] = useState(1);

  const client = mockClients.find(c => c.id === selectedClient);
  const diagnostics = clientDiagnostics[selectedClient] || [];
  const selectedPkgConfig = PACKAGE_CONFIG[selectedPackage];
  const totalPrice = selectedPkgConfig.price + selectedAddons.reduce((s, a) => s + PACKAGE_CONFIG[a].price, 0);

  const allSelectedModules = [
    ...selectedPkgConfig.modules,
    ...selectedAddons.flatMap(a => PACKAGE_CONFIG[a].modules),
  ];

  const toggleAddon = (addon: PackageTier) => {
    setSelectedAddons(prev =>
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  return (
    <div className="space-y-5 max-w-[1200px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Admin Upgrade Flow</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Diagnose client constraints → recommend package → generate contract
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: "Select Client" },
          { n: 2, label: "Diagnostic Report" },
          { n: 3, label: "Select Package" },
          { n: 4, label: "Generate Contract" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.n)}
              className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                step >= s.n ? "bg-[#3b82f6] text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
            </button>
            <span className={cn("text-xs font-medium hidden sm:block", step >= s.n ? "text-foreground" : "text-muted-foreground")}>
              {s.label}
            </span>
            {i < 3 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Client */}
      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Select Client to Upgrade</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mockClients.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedClient(c.id); setStep(2); }}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all hover:border-[#3b82f6]/40",
                  selectedClient === c.id ? "border-[#3b82f6] bg-[#3b82f6]/5" : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.businessName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={cn("text-[9px]", c.healthStatus === "CRITICAL" ? "bg-red-500/10 text-red-400 border-red-500/20" : c.healthStatus === "WARNING" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")}>
                    {c.healthStatus}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{c.industry}</span>
                </div>
                {clientDiagnostics[c.id] && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-400">
                    <AlertTriangle className="h-3 w-3" />
                    {clientDiagnostics[c.id].length} constraint{clientDiagnostics[c.id].length > 1 ? "s" : ""} detected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Diagnostic Report */}
      {step === 2 && client && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Constraint Diagnostic: {client.businessName}</h2>
            <Button size="sm" onClick={() => setStep(3)} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-xs gap-1.5 h-8">
              Proceed to Package Selection <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {diagnostics.length === 0 ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-emerald-400">No Critical Constraints Detected</p>
              <p className="text-xs text-muted-foreground mt-1">This client is performing within industry benchmarks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {diagnostics.map((diag, i) => {
                const constraintConf = CONSTRAINT_CONFIG[diag.constraint];
                return (
                  <div key={i} className="rounded-2xl border p-5" style={{ borderColor: `${constraintConf.color}30`, backgroundColor: `${constraintConf.color}05` }}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black text-white" style={{ backgroundColor: constraintConf.color }}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold" style={{ color: constraintConf.color }}>{constraintConf.label}</p>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${constraintConf.color}15`, color: constraintConf.color }}>
                            RM {(diag.rmLoss / 1000).toFixed(0)}K/month loss
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{constraintConf.description}</p>
                        <p className="text-xs text-foreground font-medium">{diag.evidence}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Zap className="h-3.5 w-3.5 text-[#8b5cf6]" />
                          <p className="text-[11px] text-[#8b5cf6] font-medium">
                            Recommended: {PACKAGE_CONFIG[diag.recommendation].label} Package
                            {" "}→ {diag.modules.map(m => MODULE_CONFIG[m].label).join(" + ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Package Selection */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Select Package for {client?.businessName}</h2>
            <Button size="sm" onClick={() => setStep(4)} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl text-xs gap-1.5 h-8">
              Generate Contract <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Core packages */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Core Package</p>
            <div className="grid grid-cols-3 gap-4">
              {packageOptions.map(pkg => {
                const conf = PACKAGE_CONFIG[pkg];
                const isSelected = selectedPackage === pkg;
                return (
                  <button
                    key={pkg}
                    onClick={() => setSelectedPackage(pkg)}
                    className={cn("rounded-2xl border p-5 text-left transition-all",
                      isSelected ? "border-[#3b82f6] bg-[#3b82f6]/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-foreground">{conf.label}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-[#3b82f6]" />}
                    </div>
                    <p className="text-2xl font-black" style={{ color: conf.color }}>RM {conf.price.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground mb-3">/month</p>
                    <div className="space-y-1.5">
                      {conf.modules.map(m => {
                        const ModIcon = moduleIcons[m] || Target;
                        return (
                          <div key={m} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: MODULE_CONFIG[m].color }} />
                            {MODULE_CONFIG[m].label}
                          </div>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Add-on Modules (Optional)</p>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {addonOptions.map(addon => {
                const conf = PACKAGE_CONFIG[addon];
                const isSelected = selectedAddons.includes(addon);
                const AddonIcon = moduleIcons[conf.modules[0]] || Target;
                return (
                  <button
                    key={addon}
                    onClick={() => toggleAddon(addon)}
                    className={cn("rounded-xl border p-4 text-left transition-all",
                      isSelected ? "border-[#8b5cf6] bg-[#8b5cf6]/5" : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${conf.color}20` }}>
                        <AddonIcon className="h-3.5 w-3.5" style={{ color: conf.color }} />
                      </div>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#8b5cf6]" />}
                    </div>
                    <p className="text-xs font-semibold text-foreground">{conf.label}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: conf.color }}>RM {conf.price.toLocaleString()}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Package Summary</h3>
              <span className="text-xl font-black text-[#3b82f6]">RM {totalPrice.toLocaleString()}/mo</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allSelectedModules.map(m => (
                <div key={m} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px]">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: MODULE_CONFIG[m].color }} />
                  {MODULE_CONFIG[m].label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Contract Generation */}
      {step === 4 && client && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Contract Generation</h2>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Client</p>
                <p className="font-semibold text-foreground">{client.businessName}</p>
                <p className="text-muted-foreground">{client.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Package</p>
                <p className="font-semibold" style={{ color: PACKAGE_CONFIG[selectedPackage].color }}>
                  {PACKAGE_CONFIG[selectedPackage].label}
                  {selectedAddons.length > 0 && ` + ${selectedAddons.length} add-on${selectedAddons.length > 1 ? "s" : ""}`}
                </p>
                <p className="text-foreground font-bold">RM {totalPrice.toLocaleString()}/month</p>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Contract includes:</p>
              <div className="space-y-1.5">
                {["Service scope and module deliverables", "Baseline snapshot protocol (captured at payment)", "Revenue doubling clause (2x = refund eligible)", "10-month credit option as alternative to cash refund", "Competition eligibility requirements", "Fraud audit clause for refund claims"].map(clause => (
                  <div key={clause} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {clause}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl h-10 text-sm font-semibold shadow-[0_0_16px_rgba(59,130,246,0.2)]">
                Generate & Send Contract PDF
              </Button>
              <Button variant="outline" className="rounded-xl h-10 px-6 text-sm font-semibold">
                Preview First
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
