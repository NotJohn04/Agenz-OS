"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Phone,
  Mail,
  MessageCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  Zap,
  Lock,
  Plus,
  CheckCircle2,
  ArrowRight,
  FileText,
  Calendar,
  QrCode,
  Wifi,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LEAD_STAGE_CONFIG } from "@/lib/constants";
import type { Lead } from "@/types";

// ─── Mock activity ────────────────────────────────────────────────────────────
function getMockActivity(lead: Lead) {
  return [
    {
      type: "note",
      icon: FileText,
      color: "#3b82f6",
      text: "Client interested in 5kW rooftop package. Needs site assessment first.",
      time: lead.lastContact,
    },
    {
      type: "stage",
      icon: ArrowRight,
      color: "#8b5cf6",
      text: `Moved to ${LEAD_STAGE_CONFIG[lead.stage]?.label ?? lead.stage}`,
      time: lead.lastContact,
    },
    {
      type: "call",
      icon: Phone,
      color: "#f59e0b",
      text: "Outbound call — no answer. Left voicemail.",
      time: lead.createdAt,
    },
    {
      type: "created",
      icon: Plus,
      color: "#10b981",
      text: `Lead created from ${lead.source}`,
      time: lead.createdAt,
    },
  ];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── QR Code SVG (WhatsApp click-to-chat QR placeholder) ─────────────────────
function QRCodeSVG({ size = 120 }: { size?: number }) {
  // Fixed 21x21 matrix that looks like a real QR code (with correct finder patterns)
  const m = [
    [1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,0,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,1],
    [0,1,0,1,0,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,0],
    [1,0,1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1],
    [0,1,0,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0],
    [1,1,0,1,0,0,1,0,0,1,0,1,0,0,1,1,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,1,0,0,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,1,0,0,1,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,0,1,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,1,0,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,1,1,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,0,1,0,0,1,1,0,1,0],
  ];
  const cellSize = size / 21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {m.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="black"
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── Social platform definitions ─────────────────────────────────────────────
interface SocialPlatform {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  initial: string;
  category: "primary" | "messaging" | "business" | "asia";
  comingSoon?: boolean;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  // Primary
  { id: "facebook", name: "Facebook Messenger", description: "Page inbox + lead forms", color: "#1877F2", bgColor: "#1877F215", initial: "f", category: "primary" },
  { id: "instagram", name: "Instagram DM", description: "Story replies + direct messages", color: "#E1306C", bgColor: "#E1306C15", initial: "ig", category: "primary" },
  { id: "tiktok", name: "TikTok Messages", description: "Comment + DM engagement", color: "#010101", bgColor: "#01010115", initial: "tt", category: "primary" },
  // Messaging
  { id: "telegram", name: "Telegram", description: "Bot + group + channel", color: "#26A5E4", bgColor: "#26A5E415", initial: "tg", category: "messaging" },
  { id: "twitter", name: "Twitter / X", description: "Mentions + DMs", color: "#000000", bgColor: "#00000015", initial: "x", category: "messaging" },
  { id: "sms", name: "SMS / MMS", description: "Twilio or local gateway", color: "#10b981", bgColor: "#10b98115", initial: "sms", category: "messaging" },
  // Business
  { id: "linkedin", name: "LinkedIn Messages", description: "B2B outreach + InMail", color: "#0A66C2", bgColor: "#0A66C215", initial: "in", category: "business" },
  { id: "email", name: "Email (SMTP)", description: "Gmail / Outlook / SMTP", color: "#EA4335", bgColor: "#EA433515", initial: "em", category: "business" },
  { id: "youtube", name: "YouTube Comments", description: "Comment management", color: "#FF0000", bgColor: "#FF000015", initial: "yt", category: "business", comingSoon: true },
  // Asia / Regional
  { id: "line", name: "LINE", description: "Popular in Thailand, Japan", color: "#00C300", bgColor: "#00C30015", initial: "ln", category: "asia", comingSoon: true },
  { id: "wechat", name: "WeChat", description: "China market integration", color: "#07C160", bgColor: "#07C16015", initial: "wc", category: "asia", comingSoon: true },
  { id: "discord", name: "Discord", description: "Community + server DMs", color: "#5865F2", bgColor: "#5865F215", initial: "dc", category: "asia", comingSoon: true },
  { id: "snapchat", name: "Snapchat", description: "Story + DM ads", color: "#FFFC00", bgColor: "#FFFC0015", initial: "sc", category: "asia", comingSoon: true },
  { id: "shopee", name: "Shopee Chat", description: "Malaysian e-commerce", color: "#EE4D2D", bgColor: "#EE4D2D15", initial: "sp", category: "asia", comingSoon: true },
  { id: "lazada", name: "Lazada Chat", description: "SEA e-commerce", color: "#0F146D", bgColor: "#0F146D15", initial: "lz", category: "asia", comingSoon: true },
];

const CATEGORY_LABELS: Record<string, string> = {
  primary: "Social Media",
  messaging: "Messaging & SMS",
  business: "Business Channels",
  asia: "Regional Platforms",
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ lead }: { lead: Lead }) {
  const stageConf = LEAD_STAGE_CONFIG[lead.stage];
  const isStale = lead.daysInStage > 14;
  const isCritical = lead.daysInStage > 30;

  return (
    <div className="space-y-4">
      {isStale && (
        <div className={cn("flex items-center gap-2 rounded-xl p-3 text-xs font-semibold",
          isCritical ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
        )}>
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
          {isCritical ? `Critical: ${lead.daysInStage} days in this stage` : `${lead.daysInStage} days in ${stageConf?.label} — follow up soon`}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: DollarSign, color: "#10b981", label: "Deal Value", value: `RM ${lead.dealValue.toLocaleString()}` },
          { icon: Clock, color: "#f59e0b", label: "Days in Stage", value: `${lead.daysInStage} days` },
          { icon: User, color: "#3b82f6", label: "Assigned Agent", value: lead.assignedAgent },
          { icon: Calendar, color: "#8b5cf6", label: "Last Contact", value: formatDate(lead.lastContact) },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-muted/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <item.icon className="h-3.5 w-3.5" style={{ color: item.color }} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contact Details</p>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-foreground">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-foreground">{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground">Source:</span>
          <span className="rounded-full bg-[#3b82f6]/10 px-2 py-0.5 text-[10px] font-semibold text-[#3b82f6]">{lead.source}</span>
        </div>
      </div>

      {/* Stage progress */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pipeline Stage</p>
        <div className="flex items-center gap-1">
          {(["NEW_LEAD", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON"] as const).map((s, i) => {
            const conf = LEAD_STAGE_CONFIG[s];
            const stageOrder = ["NEW_LEAD", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON"];
            const currentIdx = stageOrder.indexOf(lead.stage);
            const thisIdx = stageOrder.indexOf(s);
            const isPast = thisIdx < currentIdx;
            const isCurrent = s === lead.stage;
            return (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={cn("flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                  isCurrent ? "text-white shadow-md" : isPast ? "text-white opacity-60" : "bg-muted text-muted-foreground"
                )} style={isCurrent || isPast ? { backgroundColor: conf?.color ?? "#6b7280" } : undefined}>
                  {isPast ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                </div>
                {i < 5 && <div className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: isPast ? conf?.color ?? "#6b7280" : "#374151" }} />}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-center">
          <span className="text-[10px] font-semibold rounded-full px-2 py-0.5" style={{ backgroundColor: `${stageConf?.color ?? "#6b7280"}15`, color: stageConf?.color ?? "#6b7280" }}>
            {stageConf?.label ?? lead.stage}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Tab ─────────────────────────────────────────────────────────────
function ContactTab({ lead }: { lead: Lead }) {
  const [waMessage, setWaMessage] = useState(
    `Hi ${lead.name.split(" ")[0]}, thanks for your interest! I'd like to schedule a quick call to discuss your requirements. Are you available this week?`
  );
  const [emailBody, setEmailBody] = useState(
    `Hi ${lead.name.split(" ")[0]},\n\nThank you for reaching out about our services.\n\nI'd love to schedule a call to understand your business goals.\n\nBest regards,\n${lead.assignedAgent}`
  );
  const waTemplates = ["Follow-up", "Site Visit Request", "Proposal Ready", "Payment Reminder"];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-xl bg-muted/40 border border-border p-3">
        <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Contact integrations are <span className="font-semibold text-foreground">not connected yet</span>. Below is a preview of how sending will work once APIs are configured.
        </p>
      </div>

      {/* WhatsApp */}
      <div className="rounded-xl border border-[#25D366]/20 bg-[#25D366]/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/15">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">WhatsApp</p>
              <p className="text-[10px] text-muted-foreground">{lead.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] text-orange-400 border border-orange-500/20">
            <Lock className="h-2.5 w-2.5" />Not Connected
          </div>
        </div>
        <div className="mb-2.5 flex gap-1.5 flex-wrap">
          {waTemplates.map((t) => (
            <button key={t} onClick={() => setWaMessage(`Hi ${lead.name.split(" ")[0]}, ${t.toLowerCase()} — can we connect this week?`)}
              className="rounded-full text-[10px] bg-[#25D366]/10 px-2 py-0.5 text-[#25D366]/80 hover:text-[#25D366] hover:bg-[#25D366]/15 transition-colors border border-[#25D366]/20">{t}</button>
          ))}
        </div>
        <textarea value={waMessage} onChange={(e) => setWaMessage(e.target.value)} className="w-full text-xs bg-background border border-border rounded-lg p-2.5 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-[#25D366]/40" />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-2">
              <Button disabled className="w-full rounded-xl h-8 text-xs gap-1.5 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 opacity-60 cursor-not-allowed">
                <MessageCircle className="h-3.5 w-3.5" />Send WhatsApp
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Connect WhatsApp Business API in Settings → Integrations</TooltipContent>
        </Tooltip>
      </div>

      {/* Email */}
      <div className="rounded-xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/15">
              <Mail className="h-4 w-4 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Email</p>
              <p className="text-[10px] text-muted-foreground">{lead.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] text-orange-400 border border-orange-500/20">
            <Lock className="h-2.5 w-2.5" />Not Connected
          </div>
        </div>
        <div className="mb-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
          Following up on your enquiry — {lead.company}
        </div>
        <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="w-full text-xs bg-background border border-border rounded-lg p-2.5 resize-none h-24 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/40" />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-2">
              <Button disabled className="w-full rounded-xl h-8 text-xs gap-1.5 bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 opacity-60 cursor-not-allowed">
                <Mail className="h-3.5 w-3.5" />Send Email
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Connect Gmail / SMTP in Settings → Integrations</TooltipContent>
        </Tooltip>
      </div>

      {/* Call */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Phone className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Phone / AI Caller</p>
            <p className="text-[10px] text-muted-foreground">{lead.phone}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div><Button disabled variant="outline" className="w-full rounded-xl h-9 text-xs gap-1.5 opacity-50 cursor-not-allowed"><Phone className="h-3.5 w-3.5" />Call Now</Button></div>
            </TooltipTrigger>
            <TooltipContent side="bottom">Requires VoIP integration (Twilio)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div><Button disabled className="w-full rounded-xl h-9 text-xs gap-1.5 bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20 opacity-60 cursor-not-allowed"><Zap className="h-3.5 w-3.5" />AI Caller</Button></div>
            </TooltipTrigger>
            <TooltipContent side="bottom">AI Caller module required — upgrade to activate</TooltipContent>
          </Tooltip>
        </div>
        <div className="mt-3 rounded-lg bg-muted/40 border border-border/50 p-3">
          <p className="text-[10px] text-muted-foreground flex items-center gap-1.5"><Phone className="h-3 w-3" />No call records yet</p>
        </div>
      </div>
    </div>
  );
}

// ─── Conversations Tab ────────────────────────────────────────────────────────
function ConversationsTab({ lead }: { lead: Lead }) {
  const [connectedChannels, setConnectedChannels] = useState<string[]>([]);

  const waLink = `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=Hi+I%27m+interested+in+your+services`;

  const categories = Array.from(new Set(SOCIAL_PLATFORMS.map((p) => p.category)));

  function toggleConnect(id: string) {
    setConnectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  return (
    <div className="space-y-5">
      {/* WhatsApp QR — most prominent */}
      <div className="rounded-2xl border border-[#25D366]/25 bg-[#25D366]/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/15">
            <QrCode className="h-4 w-4 text-[#25D366]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">WhatsApp QR Code</p>
            <p className="text-[10px] text-muted-foreground">Customer scans to start conversation</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-2.5 py-1 text-[10px] font-semibold text-[#25D366]">
            <Wifi className="h-3 w-3" />
            Ready to scan
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="rounded-2xl bg-white p-3 shadow-lg border border-border/20">
              <QRCodeSVG size={128} />
            </div>
            {/* WhatsApp logo overlay */}
            <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] shadow-md border-2 border-background">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold text-foreground">
              {lead.name} — {lead.company}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Scan QR or click to open WhatsApp chat
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              className="flex-1 rounded-xl h-8 text-xs gap-1.5 bg-[#25D366] hover:bg-[#22c35e] text-white"
              onClick={() => window.open(waLink, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in WhatsApp
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs gap-1.5">
              <RefreshCw className="h-3 w-3" />
              Refresh QR
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 rounded-xl bg-background border border-border p-3 space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">How it works</p>
          {[
            "1. Show this QR to your lead",
            "2. They scan with their phone camera",
            "3. WhatsApp opens with a pre-filled message",
            "4. Reply → conversation appears in Conversations",
          ].map((step) => (
            <p key={step} className="text-[11px] text-muted-foreground">{step}</p>
          ))}
        </div>
      </div>

      {/* Active conversations — empty state */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-foreground mb-3">Active Conversations</p>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <MessageCircle className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs font-semibold text-foreground">No active conversations</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Connect a channel below to start messaging this lead
          </p>
        </div>
      </div>

      {/* Connect channels — grouped by category */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const platforms = SOCIAL_PLATFORMS.filter((p) => p.category === cat);
          return (
            <div key={cat}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-0.5">
                {CATEGORY_LABELS[cat]}
              </p>
              <div className="space-y-2">
                {platforms.map((platform) => {
                  const isConnected = connectedChannels.includes(platform.id);
                  return (
                    <div
                      key={platform.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 transition-all",
                        isConnected
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : "border-border bg-card"
                      )}
                    >
                      {/* Platform icon */}
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-black text-white uppercase"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.initial}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{platform.name}</p>
                        <p className="text-[10px] text-muted-foreground">{platform.description}</p>
                      </div>

                      {platform.comingSoon ? (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground flex-shrink-0">
                          Soon
                        </span>
                      ) : isConnected ? (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <button
                            onClick={() => toggleConnect(platform.id)}
                            className="text-[10px] text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => toggleConnect(platform.id)}
                              className="h-7 rounded-lg text-[10px] px-3 flex-shrink-0"
                              style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
                              variant="ghost"
                            >
                              Connect
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            OAuth / API key required — configure in Settings → Integrations
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center pb-2">
        All channels require OAuth or API configuration in Settings → Integrations
      </p>
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────
function ActivityTab({ lead }: { lead: Lead }) {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<{ text: string; time: string }[]>([]);
  const activity = getMockActivity(lead);

  function addNote() {
    if (!noteText.trim()) return;
    setNotes((prev) => [{ text: noteText.trim(), time: new Date().toISOString() }, ...prev]);
    setNoteText("");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-foreground mb-2">Add Note</p>
        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a note about this lead..." className="w-full text-xs bg-background border border-border rounded-lg p-2.5 resize-none h-16 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]/40" />
        <Button size="sm" onClick={addNote} disabled={!noteText.trim()} className="mt-2 w-full rounded-xl h-8 text-xs bg-[#3b82f6] hover:bg-[#2563eb] text-white">
          <Plus className="h-3.5 w-3.5 mr-1" />Save Note
        </Button>
      </div>

      <div className="space-y-0">
        {notes.map((n, i) => (
          <div key={`note-${i}`} className="flex gap-3 py-3 border-b border-border/40">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/15 mt-0.5">
              <FileText className="h-3.5 w-3.5 text-[#3b82f6]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground">{n.text}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Just now</p>
            </div>
          </div>
        ))}
        {activity.map((item, i) => (
          <div key={i} className="flex gap-3 py-3 border-b border-border/40 last:border-0">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full mt-0.5" style={{ backgroundColor: `${item.color}15` }}>
              <item.icon className="h-3.5 w-3.5" style={{ color: item.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground">{item.text}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(item.time)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
interface ContactPanelProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

export function ContactPanel({ lead, open, onClose }: ContactPanelProps) {
  if (!lead) return null;
  const stageConf = LEAD_STAGE_CONFIG[lead.stage];
  const isStale = lead.daysInStage > 14;
  const isCritical = lead.daysInStage > 30;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[500px] sm:w-[500px] p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border flex-shrink-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-sm font-bold text-white shadow-[0_0_16px_rgba(59,130,246,0.2)]">
              {lead.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-base">{lead.name}</h3>
              <p className="text-sm text-muted-foreground">{lead.company}</p>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: `${stageConf?.color ?? "#6b7280"}15`, color: stageConf?.color ?? "#6b7280" }}>
                  {stageConf?.label ?? lead.stage}
                </span>
                <span className="text-xs font-bold text-foreground">RM {lead.dealValue.toLocaleString()}</span>
                {isStale && (
                  <span className={cn("flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    isCritical ? "bg-red-500/10 text-red-400" : "bg-orange-500/10 text-orange-400")}>
                    <AlertTriangle className="h-2.5 w-2.5" />{lead.daysInStage}d stale
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex flex-col flex-1 overflow-hidden">
          <TabsList className="w-full rounded-none border-b border-border bg-transparent h-10 px-2 flex-shrink-0 gap-0.5">
            {[
              { value: "overview", label: "Overview" },
              { value: "contact", label: "Contact" },
              { value: "conversations", label: "Conversations" },
              { value: "activity", label: "Activity" },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="flex-1 rounded-md text-[11px] data-[state=active]:bg-[#3b82f6]/10 data-[state=active]:text-[#3b82f6]">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto p-5">
            <TabsContent value="overview" className="mt-0"><OverviewTab lead={lead} /></TabsContent>
            <TabsContent value="contact" className="mt-0"><ContactTab lead={lead} /></TabsContent>
            <TabsContent value="conversations" className="mt-0"><ConversationsTab lead={lead} /></TabsContent>
            <TabsContent value="activity" className="mt-0"><ActivityTab lead={lead} /></TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
