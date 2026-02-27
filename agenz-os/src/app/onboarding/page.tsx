"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Building2,
  TrendingUp,
  Target,
  Users,
  Wrench,
  Rocket,
  Loader2,
  AlertTriangle,
  BarChart3,
  DollarSign,
  Info,
} from "lucide-react";

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "Welcome", icon: Zap },
  { id: 2, title: "Business Profile", icon: Building2 },
  { id: 3, title: "Revenue & Spend", icon: DollarSign },
  { id: 4, title: "Lead Generation", icon: Target },
  { id: 5, title: "Sales Performance", icon: TrendingUp },
  { id: 6, title: "Tools & Team", icon: Wrench },
  { id: 7, title: "Goals", icon: Rocket },
  { id: 8, title: "Generating Blueprint", icon: BarChart3 },
  { id: 9, title: "Your Blueprint", icon: Check },
];

// ─── Industry benchmarks (Malaysian market) ───────────────────────────────────
const INDUSTRY_BENCHMARKS: Record<
  string,
  { cplLow: number; cplHigh: number; closeRateLow: number; closeRateHigh: number }
> = {
  solar:    { cplLow: 15,  cplHigh: 25,  closeRateLow: 15, closeRateHigh: 25 },
  fnb:      { cplLow: 5,   cplHigh: 15,  closeRateLow: 20, closeRateHigh: 35 },
  ecommerce:{ cplLow: 3,   cplHigh: 10,  closeRateLow: 2,  closeRateHigh: 5  },
  realestate:{ cplLow: 20, cplHigh: 50,  closeRateLow: 10, closeRateHigh: 20 },
  education:{ cplLow: 10,  cplHigh: 30,  closeRateLow: 20, closeRateHigh: 35 },
  healthcare:{ cplLow: 15, cplHigh: 40,  closeRateLow: 25, closeRateHigh: 40 },
  fashion:  { cplLow: 5,   cplHigh: 15,  closeRateLow: 15, closeRateHigh: 25 },
  services: { cplLow: 20,  cplHigh: 60,  closeRateLow: 20, closeRateHigh: 35 },
  beauty:   { cplLow: 8,   cplHigh: 20,  closeRateLow: 25, closeRateHigh: 40 },
  other:    { cplLow: 10,  cplHigh: 30,  closeRateLow: 15, closeRateHigh: 30 },
};

// ─── Form state ───────────────────────────────────────────────────────────────
interface OnboardingData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  // Step 2
  businessName: string;
  industry: string;
  location: string;
  yearsInBusiness: string;
  // Step 3 — exact numbers
  monthlyRevenue: string;       // RM exact
  monthlyAdSpend: string;       // RM exact
  profitMargin: string;         // % exact (gross margin)
  // Step 4 — exact numbers + multi-select
  monthlyLeads: string;         // exact count
  primaryLeadSource: string[];  // multi-select
  costPerLead: string;          // RM exact (optional — auto-calculated if blank)
  // Step 5 — exact numbers + multi-select
  closeRate: string;            // % exact
  avgDealValue: string;         // RM exact
  salesBottleneck: string[];    // multi-select
  // Step 6
  currentTools: string[];
  teamSize: string;
  // Step 7
  targetRevenue: string;
  biggestChallenge: string;
  timeline: string;
}

const INITIAL_DATA: OnboardingData = {
  firstName: "", lastName: "", email: "",
  businessName: "", industry: "", location: "", yearsInBusiness: "",
  monthlyRevenue: "", monthlyAdSpend: "", profitMargin: "",
  monthlyLeads: "", primaryLeadSource: [], costPerLead: "",
  closeRate: "", avgDealValue: "", salesBottleneck: [],
  currentTools: [], teamSize: "",
  targetRevenue: "", biggestChallenge: "", timeline: "",
};

// ─── Diagnostic engine ────────────────────────────────────────────────────────
type ConstraintType = "LEADS" | "SALES" | "LTV" | "CASH_FLOW";

interface DiagnosticResult {
  // Core metrics
  cpl: number;
  cac: number;
  grossProfitPerSale: number;
  ltvCacRatio: number;
  currentMonthlySales: number;
  monthlyGrossProfit: number;
  // Sensitivity (incremental monthly gross profit)
  delta_leads_20: number;
  delta_close_10pp: number;
  delta_aov_10: number;
  // Benchmark
  industryCPL: { low: number; high: number };
  industryCloseRate: { low: number; high: number };
  cplStatus: "above" | "inline" | "below";
  closeRateStatus: "below" | "inline" | "above";
  // Constraint
  primaryConstraint: ConstraintType;
  constraintLabel: string;
  constraintReason: string;
  estimatedMonthlyLoss: number;
  recommendation: string;
  priority: "critical" | "warning" | "attention";
}

function runDiagnostic(data: OnboardingData): DiagnosticResult {
  const revenue    = parseFloat(data.monthlyRevenue)  || 0;
  const adSpend    = parseFloat(data.monthlyAdSpend)  || 0;
  const marginPct  = parseFloat(data.profitMargin)    || 0; // gross margin %
  const leads      = parseFloat(data.monthlyLeads)    || 0;
  const closeRatePct = parseFloat(data.closeRate)     || 0; // %
  const aov        = parseFloat(data.avgDealValue)    || 0;
  const cplInput   = parseFloat(data.costPerLead)     || 0;

  const closeRate  = closeRatePct / 100;
  const margin     = marginPct / 100;

  // ── Derived metrics ─────────────────────────────────────────────────────────
  // CPL: use entered value, fallback to ad spend / leads
  const cpl        = cplInput > 0 ? cplInput : (leads > 0 ? adSpend / leads : 0);
  // CAC: what we pay to acquire one paying customer
  const cac        = closeRate > 0 ? cpl / closeRate : 0;
  // Gross profit per sale
  const grossProfitPerSale = aov * margin;
  // LTV/CAC — simplified (one-time sale; subscription would multiply by avg months)
  const ltvCacRatio = cac > 0 ? grossProfitPerSale / cac : 0;
  // Monthly sales (count)
  const currentMonthlySales = leads * closeRate;
  // Monthly gross profit from ad-generated revenue
  const monthlyGrossProfit = currentMonthlySales * grossProfitPerSale;

  // ── Sensitivity analysis ────────────────────────────────────────────────────
  // Incremental monthly gross profit from each lever
  // Leads +20%: same close rate, same AOV → +20% sales → +20% gross profit
  const delta_leads_20   = monthlyGrossProfit * 0.20;
  // Close rate +10pp (absolute, not relative): e.g. 20% → 30%
  const newCloseWithBoost = Math.min((closeRatePct + 10) / 100, 1);
  const delta_close_10pp = leads * newCloseWithBoost * grossProfitPerSale - monthlyGrossProfit;
  // AOV +10%: same leads, same close rate → +10% gross profit
  const delta_aov_10     = monthlyGrossProfit * 0.10;

  // ── Industry benchmarks ─────────────────────────────────────────────────────
  const bench = INDUSTRY_BENCHMARKS[data.industry] ?? INDUSTRY_BENCHMARKS["other"];
  const industryCPL        = { low: bench.cplLow, high: bench.cplHigh };
  const industryCloseRate  = { low: bench.closeRateLow, high: bench.closeRateHigh };

  // CPL status: "above" = their CPL is worse (higher) than industry high
  const cplStatus: "above" | "inline" | "below" =
    cpl > bench.cplHigh * 1.5 ? "above" :
    cpl < bench.cplLow  * 0.7 ? "below" : "inline";

  // Close rate status: "below" = their rate is worse (lower) than industry low
  const closeRateStatus: "below" | "inline" | "above" =
    closeRatePct < bench.closeRateLow  * 0.6 ? "below" :
    closeRatePct > bench.closeRateHigh * 1.3 ? "above" : "inline";

  // ── Constraint detection ────────────────────────────────────────────────────
  let primaryConstraint: ConstraintType = "LEADS";
  let constraintLabel   = "";
  let constraintReason  = "";
  let estimatedMonthlyLoss = 0;
  let recommendation    = "";
  let priority: "critical" | "warning" | "attention" = "attention";

  // Rule 1 — Cash flow: unit economics broken (grossProfitPerSale < CAC)
  // i.e. you spend more to acquire a customer than you make from them
  if (cac > 0 && grossProfitPerSale < cac) {
    primaryConstraint    = "CASH_FLOW";
    constraintLabel      = "Unit Economics Broken";
    constraintReason     = `Your cost to acquire one customer (RM ${cac.toFixed(0)}) exceeds your gross profit per sale (RM ${grossProfitPerSale.toFixed(0)}). Every sale you make loses money at the unit level. Scaling is impossible until this is fixed.`;
    estimatedMonthlyLoss = Math.abs(grossProfitPerSale - cac) * currentMonthlySales;
    recommendation       = "Pricing Review + Margin Optimisation";
    priority             = "critical";
  }
  // Rule 2 — LTV: profitable but LTV/CAC ratio < 2 (poor return on customer acquisition)
  else if (ltvCacRatio > 0 && ltvCacRatio < 2) {
    primaryConstraint    = "LTV";
    constraintLabel      = "Low Return per Customer";
    constraintReason     = `Your LTV/CAC ratio is ${ltvCacRatio.toFixed(2)}× (target: 3×+). You're profitable per sale but not enough to justify aggressive scaling. Increasing your average deal value or adding upsells would unlock more headroom.`;
    estimatedMonthlyLoss = (grossProfitPerSale * 3 - grossProfitPerSale) * currentMonthlySales * 0.3;
    recommendation       = "Sales Optimisation + Upsell Strategy";
    priority             = "warning";
  }
  // Rule 3 — Compare lead vs sales lever using marginal profit
  else {
    // Also factor in benchmark violations:
    const cplBroken       = cplStatus === "above";
    const closeRateBroken = closeRateStatus === "below";

    if (cplBroken && !closeRateBroken) {
      // CPL clearly broken, close rate fine → prioritise leads
      primaryConstraint    = "LEADS";
      constraintLabel      = "High Cost Per Lead";
      constraintReason     = `Your CPL (RM ${cpl.toFixed(0)}) is above the industry range for ${data.industry || "your sector"} (RM ${bench.cplLow}–${bench.cplHigh}). Your close rate (${closeRatePct}%) is within benchmark. Fixing your acquisition cost is the highest leverage point — +20% leads would add RM ${delta_leads_20.toFixed(0)}/mo in gross profit.`;
      estimatedMonthlyLoss = (cpl - bench.cplHigh) / cpl * monthlyGrossProfit;
      recommendation       = "Ads Performance Optimisation";
      priority             = cpl > bench.cplHigh * 2 ? "critical" : "warning";
    } else if (closeRateBroken && !cplBroken) {
      // Close rate clearly broken, CPL fine → prioritise sales
      primaryConstraint    = "SALES";
      constraintLabel      = "Low Sales Conversion Rate";
      constraintReason     = `Your close rate (${closeRatePct}%) is below the industry range for ${data.industry || "your sector"} (${bench.closeRateLow}–${bench.closeRateHigh}%). Your CPL is healthy. A +10pp improvement in close rate would add RM ${delta_close_10pp.toFixed(0)}/mo in gross profit — more than doubling leads would give.`;
      estimatedMonthlyLoss = (bench.closeRateLow / 100 - closeRate) * leads * grossProfitPerSale;
      recommendation       = "Sales Process + Follow-up System";
      priority             = closeRatePct < bench.closeRateLow * 0.4 ? "critical" : "warning";
    } else {
      // Both within benchmark or both broken: use sensitivity to decide
      if (delta_leads_20 >= delta_close_10pp) {
        primaryConstraint    = "LEADS";
        constraintLabel      = "Lead Volume is the Leverage Point";
        constraintReason     = `Based on your funnel, improving leads by 20% adds RM ${delta_leads_20.toFixed(0)}/mo in gross profit — vs RM ${delta_close_10pp.toFixed(0)}/mo from a 10pp close rate lift. Scaling lead volume gives more bang per RM invested at your current conversion level.`;
        estimatedMonthlyLoss = delta_leads_20;
        recommendation       = "Ads Performance + Lead Volume Scale";
        priority             = "attention";
      } else {
        primaryConstraint    = "SALES";
        constraintLabel      = "Sales Conversion is the Leverage Point";
        constraintReason     = `Based on your funnel, a +10pp improvement in close rate adds RM ${delta_close_10pp.toFixed(0)}/mo in gross profit — vs RM ${delta_leads_20.toFixed(0)}/mo from scaling leads by 20%. You have more lead flow than your sales process can convert.`;
        estimatedMonthlyLoss = delta_close_10pp;
        recommendation       = "Sales Optimisation + CRM Pipeline";
        priority             = "attention";
      }
    }
  }

  return {
    cpl, cac, grossProfitPerSale, ltvCacRatio,
    currentMonthlySales, monthlyGrossProfit,
    delta_leads_20, delta_close_10pp, delta_aov_10,
    industryCPL, industryCloseRate, cplStatus, closeRateStatus,
    primaryConstraint, constraintLabel, constraintReason,
    estimatedMonthlyLoss, recommendation, priority,
  };
}

// ─── Shared UI components ─────────────────────────────────────────────────────
function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="block text-sm font-semibold text-foreground">{children}</label>
      {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  min = 0,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-sm font-semibold text-muted-foreground pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        suppressHydrationWarning
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-border bg-muted/30 py-3 text-sm text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all",
          prefix ? "pl-10 pr-4" : "px-4",
          suffix ? "pr-12" : ""
        )}
      />
      {suffix && (
        <span className="absolute right-3 text-sm font-semibold text-muted-foreground pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      suppressHydrationWarning
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all"
      )}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <select
      suppressHydrationWarning
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all",
        !value && "text-muted-foreground"
      )}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function SingleChipGrid({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string; emoji?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-left transition-all",
            value === o.value
              ? "border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]"
              : "border-border bg-muted/20 text-muted-foreground hover:border-[#3b82f6]/40 hover:text-foreground"
          )}
        >
          {o.emoji && <span className="text-base">{o.emoji}</span>}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MultiChipGrid({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string; emoji?: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => {
        const selected = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-left transition-all",
              selected
                ? "border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]"
                : "border-border bg-muted/20 text-muted-foreground hover:border-[#3b82f6]/40 hover:text-foreground"
            )}
          >
            {selected
              ? <Check className="h-3.5 w-3.5 shrink-0 text-[#3b82f6]" />
              : o.emoji
              ? <span className="text-base">{o.emoji}</span>
              : <div className="h-3.5 w-3.5 shrink-0 rounded border border-muted-foreground/30" />
            }
            <span className="truncate">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 1: Welcome ──────────────────────────────────────────────────────────
function Step1({ data, set }: { data: OnboardingData; set: (k: keyof OnboardingData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6]/10 px-3 py-1 text-xs font-semibold text-[#3b82f6] mb-4">
          <Zap className="h-3 w-3" /> AI Growth Diagnostic
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Build your <span className="text-[#3b82f6]">growth blueprint</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Answer 7 questions with exact numbers. Our AI will diagnose your primary growth constraint — Leads, Sales, LTV, or Cash Flow — and tell you exactly where to invest first.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>First Name</Label>
          <TextInput value={data.firstName} onChange={(v) => set("firstName", v)} placeholder="Faizal" />
        </div>
        <div>
          <Label>Last Name</Label>
          <TextInput value={data.lastName} onChange={(v) => set("lastName", v)} placeholder="Azman" />
        </div>
      </div>
      <div>
        <Label>Work Email</Label>
        <TextInput type="email" value={data.email} onChange={(v) => set("email", v)} placeholder="faizal@solarpro.my" />
      </div>
      <div className="rounded-xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-4 flex gap-3">
        <Info className="h-4 w-4 text-[#3b82f6] shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Exact numbers produce accurate diagnostics. Approximate numbers produce generic advice.
          Your baseline is re-captured every month to track real progress.
        </p>
      </div>
    </div>
  );
}

// ─── Step 2: Business Profile ─────────────────────────────────────────────────
function Step2({ data, set }: { data: OnboardingData; set: (k: keyof OnboardingData, v: string) => void }) {
  const INDUSTRIES = [
    { label: "Solar Energy", value: "solar", emoji: "☀️" },
    { label: "F&B / Restaurant", value: "fnb", emoji: "🍜" },
    { label: "E-commerce", value: "ecommerce", emoji: "🛒" },
    { label: "Real Estate", value: "realestate", emoji: "🏠" },
    { label: "Education", value: "education", emoji: "📚" },
    { label: "Healthcare", value: "healthcare", emoji: "🏥" },
    { label: "Fashion & Retail", value: "fashion", emoji: "👗" },
    { label: "Professional Services", value: "services", emoji: "💼" },
    { label: "Beauty & Wellness", value: "beauty", emoji: "💅" },
    { label: "Other", value: "other", emoji: "🏢" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Label>Business Name</Label>
        <TextInput value={data.businessName} onChange={(v) => set("businessName", v)} placeholder="Solar Pro Malaysia" />
      </div>
      <div>
        <Label>Industry</Label>
        <SingleChipGrid options={INDUSTRIES} value={data.industry} onChange={(v) => set("industry", v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Location / City</Label>
          <TextInput value={data.location} onChange={(v) => set("location", v)} placeholder="Kuala Lumpur" />
        </div>
        <div>
          <Label>Years in Business</Label>
          <SelectInput
            value={data.yearsInBusiness}
            onChange={(v) => set("yearsInBusiness", v)}
            placeholder="Select..."
            options={[
              { label: "< 1 year", value: "<1" },
              { label: "1–2 years", value: "1-2" },
              { label: "3–5 years", value: "3-5" },
              { label: "6–10 years", value: "6-10" },
              { label: "10+ years", value: "10+" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Revenue & Spend (EXACT NUMBERS) ──────────────────────────────────
function Step3({ data, set }: { data: OnboardingData; set: (k: keyof OnboardingData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          These numbers form your <strong className="text-foreground">baseline</strong>. Enter the exact figure from last month. You&apos;ll update these monthly — that&apos;s how we track real growth.
        </p>
      </div>

      <div>
        <Label hint="Total revenue collected last month (not projected).">Monthly Revenue (RM)</Label>
        <NumberInput
          value={data.monthlyRevenue}
          onChange={(v) => set("monthlyRevenue", v)}
          prefix="RM"
          placeholder="e.g. 85000"
        />
      </div>

      <div>
        <Label hint="Total paid ad budget last month — Facebook, Google, TikTok, etc. combined.">
          Monthly Ad Spend (RM)
        </Label>
        <NumberInput
          value={data.monthlyAdSpend}
          onChange={(v) => set("monthlyAdSpend", v)}
          prefix="RM"
          placeholder="e.g. 12000"
        />
      </div>

      <div>
        <Label hint="Gross margin = (Revenue − Cost of Goods) ÷ Revenue × 100. For service businesses this is typically 60–85%.">
          Gross Margin (%)
        </Label>
        <NumberInput
          value={data.profitMargin}
          onChange={(v) => set("profitMargin", v)}
          suffix="%"
          placeholder="e.g. 72"
          min={0}
        />
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                parseFloat(data.profitMargin) >= 60
                  ? "bg-emerald-400"
                  : parseFloat(data.profitMargin) >= 35
                  ? "bg-amber-400"
                  : "bg-red-400"
              )}
              style={{ width: `${Math.min(parseFloat(data.profitMargin) || 0, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground w-16 text-right">
            {parseFloat(data.profitMargin) >= 60
              ? "✓ Healthy"
              : parseFloat(data.profitMargin) >= 35
              ? "⚠ Low"
              : data.profitMargin
              ? "✗ Critical"
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Lead Generation (EXACT NUMBERS + MULTI-SELECT) ──────────────────
function Step4({
  data,
  set,
  setArr,
}: {
  data: OnboardingData;
  set: (k: keyof OnboardingData, v: string) => void;
  setArr: (k: keyof OnboardingData, v: string[]) => void;
}) {
  const SOURCES = [
    { label: "Facebook / Instagram Ads", value: "meta", emoji: "📘" },
    { label: "Google Ads", value: "google", emoji: "🔍" },
    { label: "TikTok Ads", value: "tiktok", emoji: "🎵" },
    { label: "Organic Social Media", value: "organic", emoji: "📱" },
    { label: "Word of Mouth", value: "wom", emoji: "🗣️" },
    { label: "Website / SEO", value: "seo", emoji: "🌐" },
    { label: "Cold Calling / Direct DM", value: "cold", emoji: "📞" },
    { label: "Events / Expos", value: "events", emoji: "🎪" },
  ];

  // Auto-calculate CPL when both monthly ad spend and monthly leads are present
  const adSpend = parseFloat(data.monthlyAdSpend) || 0;
  const leads   = parseFloat(data.monthlyLeads)   || 0;
  const autoCPL = adSpend > 0 && leads > 0 ? (adSpend / leads).toFixed(2) : "";

  return (
    <div className="space-y-5">
      <div>
        <Label hint="How many leads did you receive last month? Count every inbound enquiry — DM, form fill, call, walk-in.">
          Monthly Lead Volume (exact count)
        </Label>
        <NumberInput
          value={data.monthlyLeads}
          onChange={(v) => set("monthlyLeads", v)}
          placeholder="e.g. 350"
        />
      </div>

      <div>
        <Label>Where do your leads come from? (Select all that apply)</Label>
        <MultiChipGrid
          options={SOURCES}
          value={data.primaryLeadSource}
          onChange={(v) => setArr("primaryLeadSource", v)}
        />
      </div>

      <div>
        <Label hint={autoCPL ? `Auto-calculated from your spend ÷ leads: RM ${autoCPL}. Override if your actual CPL differs.` : "Total ad spend ÷ total leads. Override if you track it separately."}>
          Average Cost Per Lead (RM)
        </Label>
        <NumberInput
          value={data.costPerLead}
          onChange={(v) => set("costPerLead", v)}
          prefix="RM"
          placeholder={autoCPL ? `Auto: RM ${autoCPL}` : "e.g. 34"}
        />
        {autoCPL && !data.costPerLead && (
          <button
            type="button"
            onClick={() => set("costPerLead", autoCPL)}
            className="mt-1.5 text-xs text-[#3b82f6] hover:underline"
          >
            Use auto-calculated: RM {autoCPL}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step 5: Sales Performance (EXACT + MULTI-SELECT) ────────────────────────
function Step5({
  data,
  set,
  setArr,
}: {
  data: OnboardingData;
  set: (k: keyof OnboardingData, v: string) => void;
  setArr: (k: keyof OnboardingData, v: string[]) => void;
}) {
  const BOTTLENECKS = [
    { label: "Leads don't respond / ghost", value: "ghosting", emoji: "👻" },
    { label: "Leads aren't quality / wrong fit", value: "low_quality", emoji: "❓" },
    { label: "Price objections", value: "price", emoji: "💸" },
    { label: "Long decision cycle", value: "slow_cycle", emoji: "⏳" },
    { label: "No structured follow-up", value: "no_followup", emoji: "🔁" },
    { label: "Losing to competitors", value: "competition", emoji: "⚔️" },
    { label: "Weak sales pitch / demo", value: "weak_pitch", emoji: "🎤" },
    { label: "Team not following up fast enough", value: "slow_response", emoji: "🐢" },
  ];

  // Show live preview of funnel math
  const leads    = parseFloat(data.monthlyLeads) || 0;
  const closeRate = parseFloat(data.closeRate)   || 0;
  const aov      = parseFloat(data.avgDealValue) || 0;
  const sales    = leads * (closeRate / 100);
  const revenue  = sales * aov;

  return (
    <div className="space-y-5">
      <div>
        <Label hint="Out of every 100 leads, how many do you close? Enter the percentage.">
          Close Rate (%)
        </Label>
        <NumberInput
          value={data.closeRate}
          onChange={(v) => set("closeRate", v)}
          suffix="%"
          placeholder="e.g. 22"
          min={0}
        />
      </div>

      <div>
        <Label hint="Average value of a single closed deal / sale (RM).">
          Average Deal / Sale Value (RM)
        </Label>
        <NumberInput
          value={data.avgDealValue}
          onChange={(v) => set("avgDealValue", v)}
          prefix="RM"
          placeholder="e.g. 15000"
        />
      </div>

      {/* Live funnel preview */}
      {leads > 0 && closeRate > 0 && aov > 0 && (
        <div className="rounded-xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-4">
          <p className="text-[10px] font-semibold text-[#3b82f6] uppercase tracking-wide mb-2.5">Live Funnel Preview</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="text-center">
              <p className="font-bold text-foreground">{leads.toFixed(0)}</p>
              <p className="text-[10px] text-muted-foreground">Leads</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <div className="text-center">
              <p className="font-bold text-foreground">{closeRate}%</p>
              <p className="text-[10px] text-muted-foreground">Close</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <div className="text-center">
              <p className="font-bold text-foreground">{sales.toFixed(0)}</p>
              <p className="text-[10px] text-muted-foreground">Sales</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <div className="text-center">
              <p className="font-bold text-[#3b82f6]">RM {revenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-muted-foreground">Revenue</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <Label>Where does your sales process break down? (Select all that apply)</Label>
        <MultiChipGrid
          options={BOTTLENECKS}
          value={data.salesBottleneck}
          onChange={(v) => setArr("salesBottleneck", v)}
        />
      </div>
    </div>
  );
}

// ─── Step 6: Tools & Team ─────────────────────────────────────────────────────
function Step6({
  data,
  set,
  setArr,
}: {
  data: OnboardingData;
  set: (k: keyof OnboardingData, v: string) => void;
  setArr: (k: keyof OnboardingData, v: string[]) => void;
}) {
  const TOOLS = [
    { label: "WhatsApp Business", value: "whatsapp", emoji: "💬" },
    { label: "Facebook / Instagram", value: "facebook", emoji: "📘" },
    { label: "Google Workspace", value: "google", emoji: "📧" },
    { label: "Spreadsheet (Excel/Sheets)", value: "excel", emoji: "📊" },
    { label: "No system / Manual tracking", value: "manual", emoji: "📝" },
    { label: "Existing CRM Software", value: "crm", emoji: "🗂️" },
    { label: "Shopee / Lazada", value: "marketplace", emoji: "🛒" },
    { label: "Website / Landing Page", value: "website", emoji: "🌐" },
  ];

  const TEAM_SIZES = [
    { label: "Just me", value: "1" },
    { label: "2–5 people", value: "2-5" },
    { label: "6–15 people", value: "6-15" },
    { label: "16–50 people", value: "16-50" },
    { label: "50+ people", value: "50+" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Label hint="Select all tools you currently use to manage leads and customers.">
          Current Tools
        </Label>
        <MultiChipGrid options={TOOLS} value={data.currentTools} onChange={(v) => setArr("currentTools", v)} />
      </div>
      <div>
        <Label>Team Size</Label>
        <SingleChipGrid options={TEAM_SIZES} value={data.teamSize} onChange={(v) => set("teamSize", v)} />
      </div>
    </div>
  );
}

// ─── Step 7: Goals ────────────────────────────────────────────────────────────
function Step7({ data, set }: { data: OnboardingData; set: (k: keyof OnboardingData, v: string) => void }) {
  const REVENUE_GOALS = [
    { label: "2× current revenue", value: "2x" },
    { label: "3× current revenue", value: "3x" },
    { label: "5× current revenue", value: "5x" },
    { label: "RM 1M+ annual revenue", value: "1m" },
  ];

  const CHALLENGES = [
    { label: "Too expensive to get leads", value: "high_cpl", emoji: "💸" },
    { label: "Leads don't convert", value: "low_conversion", emoji: "📉" },
    { label: "No time to follow up", value: "no_time", emoji: "⏰" },
    { label: "Can't see my pipeline clearly", value: "no_visibility", emoji: "👁️" },
    { label: "Need stronger brand presence", value: "brand", emoji: "📣" },
    { label: "Scaling feels overwhelming", value: "scale", emoji: "🚀" },
  ];

  const TIMELINES = [
    { label: "ASAP — 1 month", value: "1mo" },
    { label: "3 months", value: "3mo" },
    { label: "6 months", value: "6mo" },
    { label: "12 months", value: "12mo" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Label>Revenue Goal</Label>
        <SingleChipGrid options={REVENUE_GOALS} value={data.targetRevenue} onChange={(v) => set("targetRevenue", v)} />
      </div>
      <div>
        <Label>Biggest Challenge Right Now</Label>
        <SingleChipGrid options={CHALLENGES} value={data.biggestChallenge} onChange={(v) => set("biggestChallenge", v)} />
      </div>
      <div>
        <Label>Target Timeline</Label>
        <SingleChipGrid options={TIMELINES} value={data.timeline} onChange={(v) => set("timeline", v)} />
      </div>
    </div>
  );
}

// ─── Step 8: AI Generating ────────────────────────────────────────────────────
const ANALYSIS_STEPS = [
  "Capturing your business baseline...",
  "Benchmarking CPL against your industry...",
  "Benchmarking close rate against your industry...",
  "Running sensitivity analysis: Leads lever...",
  "Running sensitivity analysis: Sales lever...",
  "Calculating LTV / CAC ratio...",
  "Identifying primary growth constraint...",
  "Configuring your CRM pipeline stages...",
  "Blueprint ready.",
];

function Step8Generating() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDone((prev) => [...prev, i]);
      i++;
      setCurrent(i);
      if (i >= ANALYSIS_STEPS.length) clearInterval(interval);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-4">
      <div className="relative">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] opacity-20 blur-2xl absolute inset-0 animate-pulse" />
        <div className="relative h-24 w-24 rounded-full border-4 border-[#3b82f6]/30 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border-4 border-t-[#3b82f6] border-r-[#06b6d4] border-b-[#8b5cf6] border-l-transparent animate-spin" />
          <Zap className="absolute h-8 w-8 text-[#3b82f6]" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Analysing your funnel...</h2>
        <p className="text-sm text-muted-foreground">Running the constraint diagnostic engine.</p>
      </div>

      <div className="w-full space-y-2 text-left">
        {ANALYSIS_STEPS.map((step, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-300",
              done.includes(idx)
                ? "bg-[#10b981]/10 text-[#10b981]"
                : idx === current
                ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                : "text-muted-foreground/30"
            )}
          >
            {done.includes(idx)
              ? <Check className="h-4 w-4 shrink-0" />
              : idx === current
              ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              : <div className="h-4 w-4 rounded-full border border-muted-foreground/20 shrink-0" />
            }
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 9: Blueprint Result ─────────────────────────────────────────────────
const CONSTRAINT_CONFIG: Record<
  ConstraintType,
  { color: string; icon: React.ComponentType<{ className?: string }>; bg: string }
> = {
  LEADS:      { color: "#f97316", icon: Target,        bg: "#f97316" },
  SALES:      { color: "#8b5cf6", icon: TrendingUp,    bg: "#8b5cf6" },
  LTV:        { color: "#06b6d4", icon: DollarSign,    bg: "#06b6d4" },
  CASH_FLOW:  { color: "#ef4444", icon: AlertTriangle, bg: "#ef4444" },
};

function fmt(n: number) {
  return "RM " + Math.round(n).toLocaleString("en-MY");
}

function Step9Blueprint({ data }: { data: OnboardingData }) {
  const diag = runDiagnostic(data);
  const cfg  = CONSTRAINT_CONFIG[diag.primaryConstraint];
  const Icon = cfg.icon;

  const PIPELINE_STAGES = ["New Lead", "Contacted", "Qualified", "Proposal", "Won"];

  // Sensitivity table rows
  const scenarios = [
    {
      label: "Leads +20%",
      delta: diag.delta_leads_20,
      detail: `${Math.round(parseFloat(data.monthlyLeads) * 1.2 || 0)} leads/mo → ${Math.round(parseFloat(data.monthlyLeads) * 1.2 * parseFloat(data.closeRate) / 100)} sales`,
      isPrimary: diag.primaryConstraint === "LEADS",
    },
    {
      label: "Close Rate +10pp",
      delta: diag.delta_close_10pp,
      detail: `${parseFloat(data.closeRate) || 0}% → ${Math.min((parseFloat(data.closeRate) || 0) + 10, 100)}% → ${Math.round((parseFloat(data.monthlyLeads) || 0) * Math.min(((parseFloat(data.closeRate) || 0) + 10) / 100, 1))} sales`,
      isPrimary: diag.primaryConstraint === "SALES",
    },
    {
      label: "AOV +10%",
      delta: diag.delta_aov_10,
      detail: `${fmt(parseFloat(data.avgDealValue) || 0)} → ${fmt((parseFloat(data.avgDealValue) || 0) * 1.1)} per sale`,
      isPrimary: diag.primaryConstraint === "LTV",
    },
  ].sort((a, b) => b.delta - a.delta);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center h-14 w-14 rounded-full mb-3"
          style={{ background: `linear-gradient(135deg, ${cfg.color}40, ${cfg.color}20)`, border: `2px solid ${cfg.color}40` }}
        >
          <span style={{ color: cfg.color }}><Icon className="h-7 w-7" /></span>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Blueprint ready, {data.firstName || "there"}!
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Diagnostic complete — here&apos;s what the data says.
        </p>
      </div>

      {/* ── Key metrics ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: "Cost Per Lead",  value: diag.cpl > 0 ? fmt(diag.cpl) : "—",   sub: "actual" },
          { label: "Cost to Acquire", value: diag.cac > 0 ? fmt(diag.cac) : "—", sub: "per customer" },
          { label: "Gross Profit/Sale", value: diag.grossProfitPerSale > 0 ? fmt(diag.grossProfitPerSale) : "—", sub: `at ${data.profitMargin}% margin` },
          { label: "LTV / CAC",  value: diag.ltvCacRatio > 0 ? `${diag.ltvCacRatio.toFixed(2)}×` : "—", sub: diag.ltvCacRatio >= 3 ? "✓ Healthy" : diag.ltvCacRatio >= 2 ? "⚠ Low" : "✗ Critical" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{m.label}</p>
            <p className="text-base font-bold text-foreground mt-0.5">{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Sensitivity analysis ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-muted/10 p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Sensitivity Analysis — Monthly Gross Profit Impact
        </p>
        <div className="space-y-2.5">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 border",
                s.isPrimary
                  ? "border-[#3b82f6]/40 bg-[#3b82f6]/8"
                  : "border-border bg-muted/10"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  {s.isPrimary && (
                    <span className="text-[9px] font-bold text-[#3b82f6] bg-[#3b82f6]/15 px-1.5 py-0.5 rounded-full">
                      PRIMARY
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{s.detail}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={cn("text-sm font-bold", s.isPrimary ? "text-[#3b82f6]" : "text-foreground")}>
                  +{fmt(s.delta)}<span className="text-[10px] font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Primary constraint ────────────────────────────────────────────────── */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: `${cfg.color}30`, backgroundColor: `${cfg.color}08` }}
      >
        <div className="flex items-start gap-3">
          <span style={{ color: cfg.color }} className="shrink-0 mt-0.5"><Icon className="h-5 w-5" /></span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: cfg.color }}>
                {diag.primaryConstraint} CONSTRAINT
              </p>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}
              >
                {diag.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">{diag.constraintLabel}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{diag.constraintReason}</p>
            <p className="text-xs mt-2">
              <span className="text-muted-foreground">Recommended: </span>
              <span className="font-semibold text-foreground">{diag.recommendation}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Industry benchmark ────────────────────────────────────────────────── */}
      {data.industry && (
        <div className="rounded-xl border border-border bg-muted/10 p-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            vs. Industry Benchmark ({data.industry})
          </p>
          <div className="space-y-2.5">
            {[
              {
                label: "Cost Per Lead",
                yours: diag.cpl,
                benchLow: diag.industryCPL.low,
                benchHigh: diag.industryCPL.high,
                unit: "RM",
                lowerIsBetter: true,
              },
              {
                label: "Close Rate",
                yours: parseFloat(data.closeRate) || 0,
                benchLow: diag.industryCloseRate.low,
                benchHigh: diag.industryCloseRate.high,
                unit: "%",
                lowerIsBetter: false,
              },
            ].map((b) => {
              const isGood = b.lowerIsBetter
                ? b.yours <= b.benchHigh
                : b.yours >= b.benchLow;
              return (
                <div key={b.label} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">{b.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Industry: {b.unit === "RM" ? "RM " : ""}{b.benchLow}–{b.benchHigh}{b.unit === "%" ? "%" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      {b.unit === "RM" ? fmt(b.yours) : `${b.yours}%`}
                    </p>
                    <span className={cn("text-[10px] font-semibold", isGood ? "text-emerald-400" : "text-red-400")}>
                      {isGood ? "✓ On track" : "✗ Off benchmark"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CRM pipeline preview ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-muted/10 p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Your CRM Pipeline — Ready
        </p>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PIPELINE_STAGES.map((stage, idx) => (
            <div key={stage} className="flex items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap",
                  idx === 0
                    ? "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30"
                    : "bg-muted border border-border text-muted-foreground"
                )}
              >
                {stage}
              </div>
              {idx < PIPELINE_STAGES.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);

  const setField = useCallback((key: keyof OnboardingData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setArrayField = useCallback((key: keyof OnboardingData, value: string[]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  function next() {
    if (step === 7) {
      setStep(8);
      // Auto-advance from generating screen after all steps complete
      const duration = ANALYSIS_STEPS.length * 550 + 900;
      setTimeout(() => setStep(9), duration);
      return;
    }
    if (step < 9) setStep((s) => s + 1);
  }

  function prev() {
    if (step > 1 && step !== 8 && step !== 9) setStep((s) => s - 1);
  }

  const isGenerating = step === 8;
  const isDone       = step === 9;
  const progress     = Math.min(((step - 1) / 7) * 100, 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Agenz OS" width={120} height={32} className="h-8 w-auto" />
        </div>

        {/* Step dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={cn(
                "flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-bold transition-all",
                s < step
                  ? "bg-[#3b82f6] text-white"
                  : s === step
                  ? "bg-[#3b82f6]/20 text-[#3b82f6] ring-2 ring-[#3b82f6]/40"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {s < step ? <Check className="h-3 w-3" /> : s}
            </div>
          ))}
        </div>

        <span className="text-xs text-muted-foreground">
          {!isGenerating && !isDone ? `Step ${step} of 7` : ""}
        </span>
      </div>

      {/* Progress bar */}
      {!isGenerating && !isDone && (
        <div className="h-0.5 bg-muted shrink-0">
          <div
            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            {/* Step label */}
            {!isGenerating && !isDone && (
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Step {step} — {STEPS[step - 1]?.title}
                </p>
                <div className="h-0.5 w-8 bg-[#3b82f6] rounded-full" />
              </div>
            )}

            {/* Step content */}
            <div className="animate-fade-in">
              {step === 1 && <Step1 data={data} set={setField} />}
              {step === 2 && <Step2 data={data} set={setField} />}
              {step === 3 && <Step3 data={data} set={setField} />}
              {step === 4 && <Step4 data={data} set={setField} setArr={setArrayField} />}
              {step === 5 && <Step5 data={data} set={setField} setArr={setArrayField} />}
              {step === 6 && <Step6 data={data} set={setField} setArr={setArrayField} />}
              {step === 7 && <Step7 data={data} set={setField} />}
              {step === 8 && <Step8Generating />}
              {step === 9 && <Step9Blueprint data={data} />}
            </div>

            {/* Navigation */}
            {!isGenerating && (
              <div className="flex items-center justify-between mt-8 pb-8">
                {step > 1 && !isDone ? (
                  <button
                    onClick={prev}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {isDone ? (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#3b82f6]/20 hover:shadow-[#3b82f6]/40 transition-all"
                  >
                    <Rocket className="h-4 w-4" />
                    Launch My Dashboard
                  </button>
                ) : (
                  <button
                    onClick={next}
                    className="flex items-center gap-2 rounded-xl bg-[#3b82f6] px-6 py-3 text-sm font-bold text-white hover:bg-[#3b82f6]/90 transition-colors"
                  >
                    {step === 7 ? "Run Diagnostic" : "Continue"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
