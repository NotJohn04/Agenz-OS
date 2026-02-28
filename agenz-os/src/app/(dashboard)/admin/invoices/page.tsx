"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Send,
  CreditCard,
  X,
  Check,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────
type InvoiceStatus = "paid" | "pending" | "overdue";

interface LineItem {
  description: string;
  qty: number;
  unit: string;
  amount: number;
}

interface Invoice {
  id: string;
  service: string;
  category: string;
  client: string;
  company: string;
  email: string;
  amount: number;
  tax: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: LineItem[];
  stripeLink: string;
  proposalRef: string;
}

// ─── 16 Invoices ─────────────────────────────────────────────────────────────
const INVOICES: Invoice[] = [
  {
    id: "INV-001", service: "Beginner Growth Package", category: "Package",
    client: "Ahmad Razif", company: "FitLife Studio", email: "ahmad@fitlife.my",
    amount: 1500, tax: 90, status: "paid", issueDate: "2025-11-01", dueDate: "2025-11-08", paidDate: "2025-11-05",
    items: [{ description: "Beginner Growth Package — November 2025", qty: 1, unit: "month", amount: 1500 }],
    stripeLink: "https://buy.stripe.com/demo_beginner", proposalRef: "P001",
  },
  {
    id: "INV-002", service: "Intermediate Growth Package", category: "Package",
    client: "Nurul Hana", company: "Bunga House KL", email: "hana@bungahouse.my",
    amount: 3000, tax: 180, status: "paid", issueDate: "2025-10-15", dueDate: "2025-10-22", paidDate: "2025-10-20",
    items: [{ description: "Intermediate Growth Package — October 2025", qty: 1, unit: "month", amount: 3000 }],
    stripeLink: "https://buy.stripe.com/demo_intermediate", proposalRef: "P002",
  },
  {
    id: "INV-003", service: "Advanced Growth Package", category: "Package",
    client: "Marcus Tan", company: "TechMart Online", email: "marcus@techmart.my",
    amount: 5500, tax: 330, status: "paid", issueDate: "2026-02-01", dueDate: "2026-02-08", paidDate: "2026-02-03",
    items: [{ description: "Advanced Growth Package — February 2026", qty: 1, unit: "month", amount: 5500 }],
    stripeLink: "https://buy.stripe.com/demo_advanced", proposalRef: "P003",
  },
  {
    id: "INV-004", service: "AI Chatbot Module", category: "Add-on",
    client: "Faizal Azman", company: "Solar Pro Malaysia", email: "faizal@solarpro.my",
    amount: 800, tax: 48, status: "pending", issueDate: "2026-02-01", dueDate: "2026-02-15",
    items: [{ description: "AI Chatbot Module Setup & February Retainer", qty: 1, unit: "month", amount: 800 }],
    stripeLink: "https://buy.stripe.com/demo_chatbot", proposalRef: "P004",
  },
  {
    id: "INV-005", service: "AI Caller Module", category: "Add-on",
    client: "Siti Aisyah", company: "GreenEats Cafe", email: "siti@greeneats.my",
    amount: 1200, tax: 72, status: "pending", issueDate: "2026-02-10", dueDate: "2026-02-24",
    items: [{ description: "AI Caller Module — February 2026", qty: 1, unit: "month", amount: 1200 }],
    stripeLink: "https://buy.stripe.com/demo_caller", proposalRef: "P005",
  },
  {
    id: "INV-006", service: "Website Development", category: "One-time",
    client: "Ahmad Razif", company: "FitLife Studio", email: "ahmad@fitlife.my",
    amount: 4500, tax: 270, status: "paid", issueDate: "2025-12-01", dueDate: "2025-12-15", paidDate: "2025-12-10",
    items: [
      { description: "Website Design & Development (5 pages)", qty: 1, unit: "project", amount: 3500 },
      { description: "Hosting & Domain (1 year)", qty: 1, unit: "year", amount: 600 },
      { description: "SEO Foundation Setup", qty: 1, unit: "project", amount: 400 },
    ],
    stripeLink: "https://buy.stripe.com/demo_website", proposalRef: "P006",
  },
  {
    id: "INV-007", service: "Content Creation Package", category: "Module",
    client: "Nurul Hana", company: "Bunga House KL", email: "hana@bungahouse.my",
    amount: 1800, tax: 108, status: "pending", issueDate: "2026-01-15", dueDate: "2026-02-15",
    items: [{ description: "Content Creation Package — January 2026", qty: 1, unit: "month", amount: 1800 }],
    stripeLink: "https://buy.stripe.com/demo_content", proposalRef: "P007",
  },
  {
    id: "INV-008", service: "AI Video Production", category: "Module",
    client: "Marcus Tan", company: "TechMart Online", email: "marcus@techmart.my",
    amount: 2500, tax: 150, status: "paid", issueDate: "2026-01-15", dueDate: "2026-01-22", paidDate: "2026-01-18",
    items: [
      { description: "Short-form Videos (8 videos)", qty: 8, unit: "video", amount: 1600 },
      { description: "Long-form Videos (2 videos)", qty: 2, unit: "video", amount: 700 },
      { description: "Thumbnails & Subtitles", qty: 1, unit: "bundle", amount: 200 },
    ],
    stripeLink: "https://buy.stripe.com/demo_video", proposalRef: "P008",
  },
  {
    id: "INV-009", service: "Marketing Automation Suite", category: "Module",
    client: "Faizal Azman", company: "Solar Pro Malaysia", email: "faizal@solarpro.my",
    amount: 1500, tax: 90, status: "overdue", issueDate: "2026-01-01", dueDate: "2026-01-15",
    items: [{ description: "Marketing Automation Suite — January 2026", qty: 1, unit: "month", amount: 1500 }],
    stripeLink: "https://buy.stripe.com/demo_automation", proposalRef: "P009",
  },
  {
    id: "INV-010", service: "Ads Performance Management", category: "Module",
    client: "Siti Aisyah", company: "GreenEats Cafe", email: "siti@greeneats.my",
    amount: 2000, tax: 120, status: "pending", issueDate: "2026-02-01", dueDate: "2026-02-28",
    items: [
      { description: "Ads Management (FB/Google/TikTok) — February 2026", qty: 1, unit: "month", amount: 1600 },
      { description: "Creative A/B Testing (4 variants)", qty: 4, unit: "variant", amount: 400 },
    ],
    stripeLink: "https://buy.stripe.com/demo_ads", proposalRef: "P010",
  },
  {
    id: "INV-011", service: "Sales Optimization Program", category: "Module",
    client: "Ahmad Razif", company: "FitLife Studio", email: "ahmad@fitlife.my",
    amount: 1500, tax: 90, status: "overdue", issueDate: "2026-01-05", dueDate: "2026-01-19",
    items: [{ description: "Sales Optimization Program — January 2026", qty: 1, unit: "month", amount: 1500 }],
    stripeLink: "https://buy.stripe.com/demo_sales", proposalRef: "P011",
  },
  {
    id: "INV-012", service: "Scale Mode — Influencer Marketing", category: "Module",
    client: "Nurul Hana", company: "Bunga House KL", email: "hana@bungahouse.my",
    amount: 3000, tax: 180, status: "paid", issueDate: "2025-12-15", dueDate: "2025-12-22", paidDate: "2025-12-20",
    items: [
      { description: "Influencer Partnerships (5 micro-influencers)", qty: 5, unit: "influencer", amount: 2000 },
      { description: "UGC Content Strategy & Tracking", qty: 1, unit: "month", amount: 1000 },
    ],
    stripeLink: "https://buy.stripe.com/demo_scale", proposalRef: "P012",
  },
  {
    id: "INV-013", service: "Lead Generation Campaign", category: "Campaign",
    client: "Faizal Azman", company: "Solar Pro Malaysia", email: "faizal@solarpro.my",
    amount: 2500, tax: 150, status: "paid", issueDate: "2026-02-01", dueDate: "2026-02-08", paidDate: "2026-02-04",
    items: [
      { description: "Multi-channel Ad Campaigns", qty: 1, unit: "month", amount: 1800 },
      { description: "AI Chatbot Lead Qualification", qty: 1, unit: "month", amount: 700 },
    ],
    stripeLink: "https://buy.stripe.com/demo_leadgen", proposalRef: "P013",
  },
  {
    id: "INV-014", service: "Social Media Management", category: "Service",
    client: "Siti Aisyah", company: "GreenEats Cafe", email: "siti@greeneats.my",
    amount: 1800, tax: 108, status: "pending", issueDate: "2026-02-05", dueDate: "2026-02-28",
    items: [
      { description: "Social Media Management (IG/FB/TikTok)", qty: 1, unit: "month", amount: 1400 },
      { description: "Community Management", qty: 1, unit: "month", amount: 400 },
    ],
    stripeLink: "https://buy.stripe.com/demo_social", proposalRef: "P014",
  },
  {
    id: "INV-015", service: "WhatsApp Marketing System", category: "Service",
    client: "Marcus Tan", company: "TechMart Online", email: "marcus@techmart.my",
    amount: 1200, tax: 72, status: "pending", issueDate: "2026-02-18", dueDate: "2026-03-04",
    items: [
      { description: "WhatsApp Business API Setup", qty: 1, unit: "one-time", amount: 500 },
      { description: "Monthly Broadcast Management", qty: 1, unit: "month", amount: 700 },
    ],
    stripeLink: "https://buy.stripe.com/demo_whatsapp", proposalRef: "P015",
  },
  {
    id: "INV-016", service: "Custom AI Package — PropNest", category: "Custom",
    client: "Amirul Hakim", company: "PropNest Realty", email: "amirul@propnest.my",
    amount: 8000, tax: 480, status: "pending", issueDate: "2026-02-25", dueDate: "2026-03-11",
    items: [
      { description: "Custom AI Stack Development", qty: 1, unit: "project", amount: 4000 },
      { description: "Monthly Retainer — All Modules", qty: 1, unit: "month", amount: 3000 },
      { description: "Priority Support & SLA", qty: 1, unit: "month", amount: 1000 },
    ],
    stripeLink: "https://buy.stripe.com/demo_custom", proposalRef: "P016",
  },
];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS: Record<InvoiceStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  paid:    { label: "Paid",    color: "#10b981", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  pending: { label: "Pending", color: "#f59e0b", bg: "bg-amber-500/10",   icon: Clock },
  overdue: { label: "Overdue", color: "#ef4444", bg: "bg-red-500/10",     icon: AlertCircle },
};

// ─── Stripe modal ─────────────────────────────────────────────────────────────
function StripeModal({ invoice, onClose, onPaid }: { invoice: Invoice; onClose: () => void; onPaid: () => void }) {
  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const total = invoice.amount + invoice.tax;

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => { setStep("done"); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden">
        {step === "form" && (
          <>
            {/* Stripe-style header */}
            <div className="bg-[#635bff] px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-white/20">
                    <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white">Stripe</span>
                </div>
                <button onClick={onClose} className="text-white/60 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-white/70 text-xs">{invoice.company}</p>
              <p className="text-2xl font-black text-white mt-0.5">RM {total.toLocaleString()}</p>
              <p className="text-white/60 text-xs mt-0.5">{invoice.service}</p>
            </div>

            {/* Form */}
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Card number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Expiry</label>
                  <input type="text" placeholder="MM / YY" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">CVC</label>
                  <input type="text" placeholder="123" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff]" />
                </div>
              </div>
              <button
                onClick={handlePay}
                className="w-full rounded-xl bg-[#635bff] py-3 text-sm font-bold text-white hover:bg-[#5a52e8] transition-colors"
              >
                Pay RM {total.toLocaleString()}
              </button>
              <p className="text-center text-[10px] text-gray-400">
                Powered by <span className="font-semibold text-[#635bff]">Stripe</span> · 256-bit SSL encryption
              </p>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center gap-4 p-12">
            <RefreshCw className="h-10 w-10 animate-spin text-[#635bff]" />
            <p className="text-sm font-semibold text-gray-900">Processing payment…</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center justify-center gap-4 p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-gray-900">Payment Successful!</p>
              <p className="text-sm text-gray-500 mt-1">RM {total.toLocaleString()} received</p>
            </div>
            <button
              onClick={() => { onPaid(); onClose(); }}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Invoice Document ─────────────────────────────────────────────────────────
function InvoiceDocument({
  invoice,
  onPayNow,
}: {
  invoice: Invoice;
  onPayNow: () => void;
}) {
  const total = invoice.amount + invoice.tax;
  const s = STATUS[invoice.status];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0a0f1e] via-[#0d1526] to-[#0a0f1e] border border-white/5 p-7 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 flex items-center justify-center rounded-lg overflow-hidden bg-white/10">
                  <Image src="/logo.png" alt="Agenz OS" width={24} height={24} className="h-5 w-5 object-contain" />
                </div>
                <span className="text-[10px] font-black tracking-[0.15em] uppercase">AGENZ OS</span>
              </div>
              <p className="text-[9px] tracking-[0.25em] text-[#3b82f6] uppercase font-semibold mb-1">TAX INVOICE</p>
              <p className="text-2xl font-black">{invoice.id}</p>
              <p className="text-white/40 text-xs mt-1">{invoice.service}</p>
            </div>
            <div className="text-right">
              <span
                className="flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold"
                style={{ backgroundColor: `${s.color}25`, color: s.color, border: `1px solid ${s.color}40` }}
              >
                <s.icon className="h-2.5 w-2.5" /> {s.label}
              </span>
              <p className="text-3xl font-black mt-3">RM {total.toLocaleString()}</p>
              <p className="text-white/30 text-[10px] mt-0.5">incl. SST</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-40 w-48 rounded-full blur-[60px] bg-[#3b82f6]/10 pointer-events-none" />
        </div>

        {/* Bill to / from */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mb-3">FROM</p>
            <p className="text-sm font-bold text-foreground">Agenz MY Sdn Bhd</p>
            <p className="text-xs text-muted-foreground mt-0.5">L5-15, IKON Connaught, KL</p>
            <p className="text-xs text-muted-foreground">hello@agenz.my</p>
            <p className="text-xs text-muted-foreground">SST No: B16-1234-56789012</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mb-3">BILL TO</p>
            <p className="text-sm font-bold text-foreground">{invoice.company}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{invoice.client}</p>
            <p className="text-xs text-muted-foreground">{invoice.email}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Issue Date", value: invoice.issueDate },
            { label: "Due Date", value: invoice.dueDate },
            { label: invoice.paidDate ? "Paid Date" : "Status", value: invoice.paidDate ?? invoice.status.toUpperCase() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-3">
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{label}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Line items */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-12 gap-2 bg-muted/50 px-5 py-2.5 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-center">Unit</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          {invoice.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 border-t border-border px-5 py-3.5">
              <div className="col-span-6 text-sm text-foreground">{item.description}</div>
              <div className="col-span-2 text-center text-sm text-muted-foreground">{item.qty}</div>
              <div className="col-span-2 text-center text-sm text-muted-foreground capitalize">{item.unit}</div>
              <div className="col-span-2 text-right text-sm font-semibold text-foreground">RM {item.amount.toLocaleString()}</div>
            </div>
          ))}
          <div className="border-t border-border px-5 py-3 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span>RM {invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>SST (6%)</span>
              <span>RM {invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-foreground border-t border-border pt-2 mt-1">
              <span>Total</span>
              <span>RM {(invoice.amount + invoice.tax).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment section */}
        {invoice.status !== "paid" ? (
          <div className="rounded-2xl border border-[#635bff]/30 bg-[#635bff]/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Pay Now via Stripe</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {invoice.status === "overdue" ? "⚠️ This invoice is overdue. Please pay immediately." : "Secure payment powered by Stripe."}
                </p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-xs font-black"
                style={{ backgroundColor: "#635bff" }}
              >
                S
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onPayNow}
                className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: "#635bff" }}
              >
                <CreditCard className="h-4 w-4" />
                Pay RM {(invoice.amount + invoice.tax).toLocaleString()}
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-3.5 w-3.5" />
                Open Stripe Link
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Payment Received</p>
              <p className="text-xs text-muted-foreground">Paid on {invoice.paidDate} · Thank you!</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/40 pb-2">
          Agenz MY Sdn Bhd · Reg No: 202401234567 · L5-15, IKON Connaught, KL
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(INVOICES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>("all");
  const [selected, setSelected] = useState<Invoice>(INVOICES[0]);
  const [stripeTarget, setStripeTarget] = useState<Invoice | null>(null);

  const counts = {
    all: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "pending").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
  };

  const totalCollected = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount + i.tax, 0);
  const totalPending = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount + i.tax, 0);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.service.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.company.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handlePaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, status: "paid" as InvoiceStatus, paidDate: new Date().toISOString().split("T")[0] }
          : inv
      )
    );
    setSelected((prev) => ({ ...prev, status: "paid", paidDate: new Date().toISOString().split("T")[0] }));
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Left panel */}
      <div className="flex w-[320px] flex-shrink-0 flex-col border-r border-border bg-background">
        <div className="px-4 pt-4 pb-3 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-foreground">Invoices</h1>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
              {counts.pending + counts.overdue} outstanding
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices…"
              className="w-full rounded-lg border border-border bg-muted/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["all", "paid", "pending", "overdue"] as const).map((s) => {
              const colors = { all: "#6b7280", paid: "#10b981", pending: "#f59e0b", overdue: "#ef4444" };
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all capitalize"
                  style={
                    statusFilter === s
                      ? { backgroundColor: colors[s], color: "white" }
                      : { backgroundColor: "transparent", color: "#6b7280" }
                  }
                >
                  {s} ({counts[s]})
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-emerald-500/10 px-3 py-2">
              <p className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">Collected</p>
              <p className="text-sm font-bold text-foreground">RM {totalCollected.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 px-3 py-2">
              <p className="text-[9px] text-amber-400 font-semibold uppercase tracking-wider">Outstanding</p>
              <p className="text-sm font-bold text-foreground">RM {totalPending.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filtered.map((inv) => {
            const s = STATUS[inv.status];
            return (
              <button
                key={inv.id}
                onClick={() => setSelected(inv)}
                className={cn(
                  "w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all",
                  selected.id === inv.id ? "bg-[#3b82f6]/10 ring-1 ring-[#3b82f6]/20" : "hover:bg-muted"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <s.icon className="h-4 w-4 flex-shrink-0" style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-[12px] font-semibold truncate", selected.id === inv.id ? "text-[#3b82f6]" : "text-foreground")}>
                      {inv.id}
                    </p>
                    <p className="text-[10px] font-bold text-foreground flex-shrink-0">RM {(inv.amount + inv.tax).toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{inv.service}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] text-muted-foreground">{inv.company}</p>
                    <span className="text-[9px] font-semibold" style={{ color: s.color }}>{s.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-5 py-3 bg-background/80">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            {selected.id}
            <span className="text-muted-foreground text-[11px] font-normal">· {selected.service}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Send className="h-3.5 w-3.5" /> Send Reminder
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            {selected.status !== "paid" && (
              <button
                onClick={() => setStripeTarget(selected)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-colors"
                style={{ backgroundColor: "#635bff" }}
              >
                <CreditCard className="h-3.5 w-3.5" /> Pay via Stripe
              </button>
            )}
          </div>
        </div>

        <InvoiceDocument invoice={selected} onPayNow={() => setStripeTarget(selected)} />
      </div>

      {stripeTarget && (
        <StripeModal
          invoice={stripeTarget}
          onClose={() => setStripeTarget(null)}
          onPaid={() => handlePaid(stripeTarget.id)}
        />
      )}
    </div>
  );
}
