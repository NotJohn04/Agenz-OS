"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  Download,
  Eye,
  Edit2,
  ChevronRight,
  DollarSign,
  Calendar,
  Building2,
  Zap,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────
type ProposalStatus = "signed" | "sent" | "draft" | "declined";

interface Proposal {
  id: string;
  service: string;
  category: string;
  client: string;
  company: string;
  price: number;
  cycle: "monthly" | "one-time" | "quarterly";
  status: ProposalStatus;
  date: string;
  validUntil?: string;
  description: string;
  deliverables: string[];
  modules: string[];
  stripeLink?: string;
}

// ─── 16 Service proposals ────────────────────────────────────────────────────
const PROPOSALS: Proposal[] = [
  {
    id: "P001", service: "Beginner Growth Package", category: "Package",
    client: "Ahmad Razif", company: "FitLife Studio",
    price: 1500, cycle: "monthly", status: "signed", date: "2025-11-01",
    description: "Entry-level AI-powered growth package for businesses ready to scale their digital presence.",
    deliverables: ["Facebook & Google Ads management", "Monthly performance report", "CRM pipeline setup", "Sales funnel optimization", "2× monthly strategy calls"],
    modules: ["Ads Performance", "Sales Optimization"],
    stripeLink: "https://buy.stripe.com/demo",
  },
  {
    id: "P002", service: "Intermediate Growth Package", category: "Package",
    client: "Nurul Hana", company: "Bunga House KL",
    price: 3000, cycle: "monthly", status: "signed", date: "2025-10-15",
    description: "Mid-tier package combining ads, CRM, AI chatbot, and web presence for accelerated growth.",
    deliverables: ["Full ads management (FB/Google/TikTok)", "AI chatbot setup & training", "Website optimization", "CRM + pipeline management", "Weekly reporting", "4× monthly strategy calls"],
    modules: ["Ads Performance", "Sales Optimization", "AI Chatbot", "Website"],
    stripeLink: "https://buy.stripe.com/demo",
  },
  {
    id: "P003", service: "Advanced Growth Package", category: "Package",
    client: "Marcus Tan", company: "TechMart Online",
    price: 5500, cycle: "monthly", status: "signed", date: "2025-09-01",
    description: "Full-stack AI growth system with all 9 modules — the complete Agenz OS experience.",
    deliverables: ["All 9 module activations", "Dedicated account strategist", "Daily performance monitoring", "Custom AI workflow automation", "Bi-weekly executive reviews", "Priority support (4h SLA)"],
    modules: ["All 9 Modules"],
    stripeLink: "https://buy.stripe.com/demo",
  },
  {
    id: "P004", service: "AI Chatbot Module", category: "Add-on",
    client: "Faizal Azman", company: "Solar Pro Malaysia",
    price: 800, cycle: "monthly", status: "sent", date: "2026-02-01", validUntil: "2026-03-01",
    description: "Deploy a trained AI chatbot to qualify leads 24/7 on your website and WhatsApp.",
    deliverables: ["Custom chatbot training on your FAQs", "Website widget integration", "WhatsApp Business integration", "Lead qualification flow", "Monthly conversation analytics"],
    modules: ["AI Chatbot"],
    stripeLink: "https://buy.stripe.com/demo",
  },
  {
    id: "P005", service: "AI Caller Module", category: "Add-on",
    client: "Siti Aisyah", company: "GreenEats Cafe",
    price: 1200, cycle: "monthly", status: "draft", date: "2026-02-10",
    description: "Autonomous AI voice caller that follows up with leads and books appointments automatically.",
    deliverables: ["AI voice call scripting", "Lead follow-up automation (within 5 min)", "Appointment booking integration", "Call recording & transcription", "Performance dashboard"],
    modules: ["AI Caller"],
  },
  {
    id: "P006", service: "Website Development", category: "One-time",
    client: "Ahmad Razif", company: "FitLife Studio",
    price: 4500, cycle: "one-time", status: "signed", date: "2025-12-01",
    description: "High-converting landing page and business website built for SEO and lead generation.",
    deliverables: ["5-page responsive website", "SEO foundation setup", "Lead capture forms", "Google Analytics integration", "1-year hosting included", "2 rounds of revisions"],
    modules: ["Website"],
    stripeLink: "https://buy.stripe.com/demo",
  },
  {
    id: "P007", service: "Content Creation Package", category: "Module",
    client: "Nurul Hana", company: "Bunga House KL",
    price: 1800, cycle: "monthly", status: "sent", date: "2026-01-15", validUntil: "2026-02-28",
    description: "Strategic content creation for social media, ads, and SEO to build brand authority.",
    deliverables: ["16 social media posts/month", "4 short-form video scripts", "2 blog articles/month", "Content calendar", "Monthly content strategy session"],
    modules: ["Content Creation"],
  },
  {
    id: "P008", service: "AI Video Production", category: "Module",
    client: "Marcus Tan", company: "TechMart Online",
    price: 2500, cycle: "monthly", status: "signed", date: "2025-11-15",
    description: "AI-powered video content for ads, social media, and product showcases.",
    deliverables: ["8 short-form videos/month (15-60s)", "2 long-form videos/month", "AI voiceover & subtitles", "Thumbnail design", "Platform-optimized formats"],
    modules: ["AI Video"],
    stripeLink: "https://buy.stripe.com/demo",
  },
  {
    id: "P009", service: "Marketing Automation Suite", category: "Module",
    client: "Faizal Azman", company: "Solar Pro Malaysia",
    price: 1500, cycle: "monthly", status: "draft", date: "2026-02-15",
    description: "End-to-end marketing automation — from lead capture to nurture sequences to closing.",
    deliverables: ["Lead capture automation", "Email/WhatsApp nurture sequence (7 steps)", "Abandoned lead re-engagement", "Referral automation", "Monthly automation audit"],
    modules: ["Automation"],
  },
  {
    id: "P010", service: "Ads Performance Management", category: "Module",
    client: "Siti Aisyah", company: "GreenEats Cafe",
    price: 2000, cycle: "monthly", status: "sent", date: "2026-02-01", validUntil: "2026-03-15",
    description: "Full-service paid ads management across Facebook, Google, TikTok, and Instagram.",
    deliverables: ["Multi-platform ad management", "Creative A/B testing (4 variants/month)", "Audience research & optimization", "Landing page CRO", "Weekly performance reports"],
    modules: ["Ads Performance"],
  },
  {
    id: "P011", service: "Sales Optimization Program", category: "Module",
    client: "Ahmad Razif", company: "FitLife Studio",
    price: 1500, cycle: "monthly", status: "draft", date: "2026-02-20",
    description: "Systematic sales process improvement to increase close rates and deal values.",
    deliverables: ["Sales script development", "CRM pipeline optimization", "Close rate tracking & coaching", "Objection handling playbook", "Monthly sales review"],
    modules: ["Sales Optimization"],
  },
  {
    id: "P012", service: "Scale Mode — Influencer Marketing", category: "Module",
    client: "Nurul Hana", company: "Bunga House KL",
    price: 3000, cycle: "monthly", status: "declined", date: "2026-01-10",
    description: "Influencer partnership strategy to amplify brand reach and drive quality leads.",
    deliverables: ["5 micro-influencer collaborations/month", "UGC content strategy", "Affiliate tracking setup", "Influencer contract templates", "Monthly ROI reporting"],
    modules: ["Influencer Marketing"],
  },
  {
    id: "P013", service: "Lead Generation Campaign", category: "Campaign",
    client: "Faizal Azman", company: "Solar Pro Malaysia",
    price: 2500, cycle: "monthly", status: "signed", date: "2025-10-01",
    description: "Dedicated lead generation campaign combining paid ads and AI chatbot for maximum volume.",
    deliverables: ["100+ leads/month guarantee", "Multi-channel ad campaigns", "AI chatbot lead qualification", "Real-time lead dashboard", "Weekly optimization calls"],
    modules: ["Ads Performance", "AI Chatbot"],
    stripeLink: "https://buy.stripe.com/demo",
  },
  {
    id: "P014", service: "Social Media Management", category: "Service",
    client: "Siti Aisyah", company: "GreenEats Cafe",
    price: 1800, cycle: "monthly", status: "sent", date: "2026-02-05", validUntil: "2026-03-05",
    description: "Full social media management across Instagram, Facebook, and TikTok.",
    deliverables: ["Daily content posting", "Community management & replies", "Monthly growth analytics", "Story & reel production", "Hashtag & SEO strategy"],
    modules: ["Content Creation", "AI Video"],
  },
  {
    id: "P015", service: "WhatsApp Marketing System", category: "Service",
    client: "Marcus Tan", company: "TechMart Online",
    price: 1200, cycle: "monthly", status: "draft", date: "2026-02-18",
    description: "Automated WhatsApp marketing campaigns to nurture and convert leads at scale.",
    deliverables: ["WhatsApp Business API setup", "Broadcast campaign management", "Drip sequence automation", "Template message creation", "Opt-in landing page"],
    modules: ["AI Chatbot", "Automation"],
  },
  {
    id: "P016", service: "Custom AI Package", category: "Custom",
    client: "Open", company: "—",
    price: 8000, cycle: "monthly", status: "draft", date: "2026-02-25",
    description: "Fully custom AI growth system tailored to your unique business requirements.",
    deliverables: ["Custom module stack selection", "Bespoke AI workflow development", "Dedicated project manager", "Custom integrations (CRM, ERP, etc.)", "SLA guarantee & priority support", "Quarterly business reviews"],
    modules: ["Custom Stack"],
  },
];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  signed:   { label: "Signed",   color: "#10b981", icon: CheckCircle2 },
  sent:     { label: "Sent",     color: "#3b82f6",  icon: Send },
  draft:    { label: "Draft",    color: "#6b7280",  icon: Edit2 },
  declined: { label: "Declined", color: "#ef4444",  icon: XCircle },
};

// ─── Proposal Document ────────────────────────────────────────────────────────
function ProposalDocument({ proposal }: { proposal: Proposal }) {
  const status = STATUS_CONFIG[proposal.status];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Cover */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0a0f1e] via-[#0d1526] to-[#0a0f1e] border border-white/5 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 flex items-center justify-center rounded-lg overflow-hidden bg-white/10">
                  <Image src="/logo.png" alt="Agenz OS" width={24} height={24} className="h-5 w-5 object-contain" />
                </div>
                <span className="text-[10px] font-black tracking-[0.15em] uppercase">AGENZ OS</span>
              </div>
              <span
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{ backgroundColor: `${status.color}20`, color: status.color, border: `1px solid ${status.color}40` }}
              >
                <status.icon className="h-2.5 w-2.5" />
                {status.label}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-semibold tracking-[0.25em] text-[#3b82f6] uppercase mb-2">SERVICE PROPOSAL</p>
              <h1 className="text-3xl font-black leading-tight">{proposal.service}</h1>
              <p className="text-white/40 mt-2 text-sm">{proposal.description}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <div>
                <p className="text-[9px] tracking-widest text-white/25 uppercase">Prepared For</p>
                <p className="text-sm font-bold mt-0.5">{proposal.client}</p>
                <p className="text-xs text-white/40">{proposal.company}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-widest text-white/25 uppercase">Date</p>
                <p className="text-sm font-bold mt-0.5">{proposal.date}</p>
              </div>
              {proposal.validUntil && (
                <div>
                  <p className="text-[9px] tracking-widest text-white/25 uppercase">Valid Until</p>
                  <p className="text-sm font-bold mt-0.5">{proposal.validUntil}</p>
                </div>
              )}
              <div>
                <p className="text-[9px] tracking-widest text-white/25 uppercase">Ref</p>
                <p className="text-sm font-bold mt-0.5">{proposal.id}</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full blur-[60px] bg-[#3b82f6]/10 pointer-events-none" />
        </div>

        {/* Modules */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">SCOPE OF SERVICES</p>
          <div className="flex flex-wrap gap-2">
            {proposal.modules.map((m) => (
              <span key={m} className="rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-3 py-1 text-xs font-semibold text-[#3b82f6]">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">DELIVERABLES</p>
          <div className="space-y-2.5">
            {proposal.deliverables.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 mt-0.5">
                  <Check className="h-2.5 w-2.5 text-[#3b82f6]" />
                </div>
                <p className="text-sm text-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">INVESTMENT</p>
          <div className="flex items-end justify-between rounded-xl bg-muted/50 p-5">
            <div>
              <p className="text-xs text-muted-foreground">{proposal.category}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{proposal.service}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-foreground">RM {proposal.price.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {proposal.cycle === "monthly" ? "/ month" : proposal.cycle === "quarterly" ? "/ quarter" : "one-time"}
              </p>
            </div>
          </div>
          {proposal.cycle === "monthly" && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-[10px] text-muted-foreground">Annual Value</p>
                <p className="text-base font-bold text-foreground mt-0.5">RM {(proposal.price * 12).toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-[10px] text-muted-foreground">Billing</p>
                <p className="text-base font-bold text-foreground mt-0.5">Monthly</p>
              </div>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-3">TERMS & CONDITIONS</p>
          <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
            <p>• Payment due within 7 days of invoice date. Monthly services billed in advance.</p>
            <p>• 30-day notice required for cancellation of monthly services.</p>
            <p>• All strategies and creative assets produced remain the property of the client upon full payment.</p>
            <p>• Results are subject to market conditions. KPI targets are goals, not guarantees.</p>
            <p>• This proposal is valid for 30 days from the date of issue.</p>
          </div>
        </div>

        {/* Signature */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-4">SIGNATURES</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-6">Agenz MY (Service Provider)</p>
              <div className="border-b border-border pt-6">
                <p className="text-xs font-semibold text-foreground">Hakim Aziz</p>
                <p className="text-[10px] text-muted-foreground">Director · Agenz MY</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-6">{proposal.company} (Client)</p>
              <div className="border-b border-border pt-6">
                {proposal.status === "signed" ? (
                  <>
                    <p className="text-xs font-semibold text-foreground">{proposal.client}</p>
                    <p className="text-[10px] text-emerald-400">✓ Signed {proposal.date}</p>
                  </>
                ) : (
                  <p className="text-[10px] text-muted-foreground italic">Awaiting signature</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/40 pb-2">
          Agenz MY · L5-15, IKON Connaught, KL · hello@agenz.my · agenz.my
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProposalsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProposalStatus>("all");
  const [selected, setSelected] = useState<Proposal>(PROPOSALS[0]);

  const counts = {
    all: PROPOSALS.length,
    signed: PROPOSALS.filter((p) => p.status === "signed").length,
    sent: PROPOSALS.filter((p) => p.status === "sent").length,
    draft: PROPOSALS.filter((p) => p.status === "draft").length,
    declined: PROPOSALS.filter((p) => p.status === "declined").length,
  };

  const filtered = PROPOSALS.filter((p) => {
    const matchSearch =
      p.service.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = PROPOSALS.filter((p) => p.status === "signed").reduce((s, p) => s + p.price, 0);

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Left panel */}
      <div className="flex w-[320px] flex-shrink-0 flex-col border-r border-border bg-background">
        <div className="px-4 pt-4 pb-3 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-foreground">Proposals</h1>
            <Badge className="bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20 text-[10px]">
              {counts.signed} signed
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search proposals…"
              className="w-full rounded-lg border border-border bg-muted/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["all", "signed", "sent", "draft", "declined"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all capitalize",
                  statusFilter === s ? "bg-[#3b82f6] text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {s} {s !== "all" && `(${counts[s]})`}
              </button>
            ))}
          </div>
          <div className="rounded-xl bg-muted/50 px-3 py-2">
            <p className="text-[10px] text-muted-foreground">Active MRR from signed</p>
            <p className="text-sm font-bold text-foreground">RM {totalValue.toLocaleString()}<span className="text-muted-foreground font-normal text-[10px]">/mo</span></p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filtered.map((p) => {
            const status = STATUS_CONFIG[p.status];
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={cn(
                  "w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all",
                  selected.id === p.id ? "bg-[#3b82f6]/10 ring-1 ring-[#3b82f6]/20" : "hover:bg-muted"
                )}
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold mt-0.5"
                  style={{ backgroundColor: `${status.color}15`, color: status.color }}
                >
                  {p.id.replace("P", "")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-[12px] font-semibold truncate", selected.id === p.id ? "text-[#3b82f6]" : "text-foreground")}>
                    {p.service}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{p.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="flex items-center gap-0.5 text-[9px] font-semibold rounded-full px-1.5 py-0.5"
                      style={{ backgroundColor: `${status.color}15`, color: status.color }}
                    >
                      <status.icon className="h-2 w-2" />
                      {status.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">RM {p.price.toLocaleString()}/{p.cycle === "monthly" ? "mo" : p.cycle}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-5 py-3 bg-background/80">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {selected.service}
            <span className="text-muted-foreground text-[11px] font-normal">· {selected.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Send className="h-3.5 w-3.5" /> Send
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3b82f6]/90 transition-colors">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
          </div>
        </div>

        <ProposalDocument proposal={selected} />
      </div>
    </div>
  );
}
