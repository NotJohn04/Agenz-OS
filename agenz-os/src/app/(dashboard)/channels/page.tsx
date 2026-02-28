"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Check,
  X,
  QrCode,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Smartphone,
  AlertCircle,
  Clock,
  Plug,
  Radio,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Types ──────────────────────────────────────────────────────────────────────
type Status = "connected" | "disconnected" | "connecting" | "coming_soon";

interface Platform {
  id: string;
  name: string;
  description: string;
  color: string;
  bg: string;
  logoText: string;
  connectedCount?: number;
  authType: "qr" | "oauth" | "token";
  status: Status;
}

// ─── Platform data ───────────────────────────────────────────────────────────────
const PLATFORMS: Platform[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect your WhatsApp Business account to message leads directly.",
    color: "#25D366",
    bg: "#25D366",
    logoText: "WA",
    connectedCount: 1,
    authType: "qr",
    status: "connected",
  },
  {
    id: "instagram",
    name: "Instagram DM",
    description: "Respond to Instagram DMs and story replies from your leads.",
    color: "#E1306C",
    bg: "#E1306C",
    logoText: "IG",
    authType: "oauth",
    status: "disconnected",
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    description: "Manage Facebook page messages and comments in one place.",
    color: "#0084FF",
    bg: "#0084FF",
    logoText: "FB",
    authType: "oauth",
    status: "disconnected",
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Connect a Telegram bot to send and receive messages with leads.",
    color: "#0088cc",
    bg: "#0088cc",
    logoText: "TG",
    authType: "token",
    status: "disconnected",
  },
  {
    id: "tiktok",
    name: "TikTok DM",
    description: "Reply to TikTok DMs from users who engage with your content.",
    color: "#fe2c55",
    bg: "#010101",
    logoText: "TT",
    authType: "oauth",
    status: "disconnected",
  },
  {
    id: "twitter",
    name: "Twitter / X DM",
    description: "Manage Twitter DMs with leads who reach out via X.",
    color: "#000000",
    bg: "#000000",
    logoText: "X",
    authType: "oauth",
    status: "coming_soon",
  },
  {
    id: "linkedin",
    name: "LinkedIn Messages",
    description: "Connect LinkedIn to follow up on lead conversations.",
    color: "#0A66C2",
    bg: "#0A66C2",
    logoText: "LI",
    authType: "oauth",
    status: "coming_soon",
  },
  {
    id: "email",
    name: "Email (SMTP)",
    description: "Send and receive emails with leads using your business email.",
    color: "#6b7280",
    bg: "#6b7280",
    logoText: "EM",
    authType: "token",
    status: "disconnected",
  },
];

// ─── QR Code SVG ────────────────────────────────────────────────────────────────
function QRCodeSVG() {
  const grid = [
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,1,0],
    [0,0,1,1,0,1,0,0,0,1,0,1,1,0,0,1,0,0,1,0,1],
    [1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1],
    [0,1,0,1,1,0,0,1,0,1,0,1,0,0,1,0,0,1,1,0,0],
    [1,1,0,0,1,0,1,0,1,0,0,1,1,0,1,0,1,0,0,1,0],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1],
    [1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,1,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,1,0,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0],
  ];
  const cell = 7;
  const total = 21 * cell;
  return (
    <div className="bg-white p-3 rounded-xl inline-block">
      <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`}>
        {grid.map((row, y) =>
          row.map((c, x) =>
            c ? <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="#111" /> : null
          )
        )}
      </svg>
    </div>
  );
}

// ─── Connect modal ───────────────────────────────────────────────────────────────
function ConnectModal({
  platform,
  onClose,
  onConnect,
}: {
  platform: Platform;
  onClose: () => void;
  onConnect: () => void;
}) {
  const [step, setStep] = useState<"idle" | "scanning" | "done">("idle");

  const handleSimulate = () => {
    setStep("scanning");
    setTimeout(() => {
      setStep("done");
      setTimeout(() => {
        onConnect();
        onClose();
      }, 1200);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-background shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Platform header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black text-white"
            style={{ backgroundColor: platform.bg }}
          >
            {platform.logoText}
          </div>
          <div>
            <p className="text-base font-bold text-foreground">Connect {platform.name}</p>
            <p className="text-xs text-muted-foreground">{platform.description}</p>
          </div>
        </div>

        {platform.authType === "qr" && (
          <>
            {step === "idle" && (
              <div className="flex flex-col items-center gap-5">
                <QRCodeSVG />
                <div className="w-full space-y-2">
                  {[
                    `Open ${platform.name} on your phone`,
                    "Go to Settings → Linked Devices",
                    "Tap 'Link a Device' and scan this QR",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                        style={{ backgroundColor: platform.color }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{text}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full text-sm font-semibold"
                  style={{ backgroundColor: platform.color, color: "white" }}
                  onClick={handleSimulate}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Simulate QR Scan (Demo)
                </Button>
              </div>
            )}

            {step === "scanning" && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full animate-pulse"
                  style={{ backgroundColor: `${platform.color}25` }}
                >
                  <RefreshCw className="h-7 w-7 animate-spin" style={{ color: platform.color }} />
                </div>
                <p className="text-sm font-semibold text-foreground">Connecting…</p>
                <p className="text-xs text-muted-foreground">Verifying QR scan with {platform.name}</p>
              </div>
            )}

            {step === "done" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${platform.color}25` }}
                >
                  <Check className="h-7 w-7" style={{ color: platform.color }} />
                </div>
                <p className="text-sm font-semibold text-foreground">Connected!</p>
                <p className="text-xs text-muted-foreground">{platform.name} is now linked</p>
              </div>
            )}
          </>
        )}

        {platform.authType === "oauth" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
              You&apos;ll be redirected to {platform.name} to authorize Agenz OS to access your messages.
              We only request messaging permissions.
            </div>
            <Button
              className="w-full text-sm font-semibold"
              style={{ backgroundColor: platform.color, color: "white" }}
              onClick={() => { onConnect(); onClose(); }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Authorize with {platform.name}
            </Button>
          </div>
        )}

        {platform.authType === "token" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                {platform.id === "telegram" ? "Bot Token" : "SMTP Configuration"}
              </label>
              <input
                type="text"
                placeholder={platform.id === "telegram" ? "1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ" : "smtp.yourdomain.com"}
                className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40"
              />
            </div>
            <Button
              className="w-full text-sm font-semibold"
              style={{ backgroundColor: platform.color, color: "white" }}
              onClick={() => { onConnect(); onClose(); }}
            >
              <Plug className="h-4 w-4 mr-2" />
              Connect {platform.name}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Platform card ───────────────────────────────────────────────────────────────
function PlatformCard({
  platform,
  onConnect,
  onDisconnect,
}: {
  platform: Platform;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}) {
  const [showModal, setShowModal] = useState(false);

  const statusBadge = {
    connected:    { label: "Connected",    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    disconnected: { label: "Not connected", cls: "bg-muted text-muted-foreground border-border" },
    connecting:   { label: "Connecting…",  cls: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20" },
    coming_soon:  { label: "Coming soon",  cls: "bg-muted/50 text-muted-foreground/50 border-border/50" },
  };

  const badge = statusBadge[platform.status];

  return (
    <>
      <div
        className={cn(
          "relative rounded-2xl border border-border bg-card p-5 transition-all duration-200",
          platform.status === "coming_soon"
            ? "opacity-50"
            : "hover:border-border/80 hover:shadow-md hover:shadow-black/10"
        )}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm"
              style={{ backgroundColor: platform.bg }}
            >
              {platform.logoText}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{platform.name}</p>
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold mt-0.5",
                badge.cls
              )}>
                {platform.status === "connected" && <Check className="h-2.5 w-2.5" />}
                {platform.status === "coming_soon" && <Clock className="h-2.5 w-2.5" />}
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
          {platform.description}
        </p>

        {/* Connected details */}
        {platform.status === "connected" && platform.connectedCount && (
          <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <p className="text-[10px] font-semibold text-emerald-400">
              {platform.connectedCount} account{platform.connectedCount > 1 ? "s" : ""} connected
            </p>
          </div>
        )}

        {/* Action */}
        {platform.status === "connected" ? (
          <button
            onClick={() => onDisconnect(platform.id)}
            className="w-full rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-red-500/40 hover:text-red-400 transition-colors"
          >
            Disconnect
          </button>
        ) : platform.status === "coming_soon" ? (
          <button
            disabled
            className="w-full rounded-xl border border-border/50 px-3 py-2 text-xs font-semibold text-muted-foreground/40 cursor-not-allowed"
          >
            Coming Soon
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="w-full rounded-xl px-3 py-2 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: platform.color }}
          >
            Connect {platform.name}
          </button>
        )}
      </div>

      {showModal && (
        <ConnectModal
          platform={platform}
          onClose={() => setShowModal(false)}
          onConnect={() => onConnect(platform.id)}
        />
      )}
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────────
export default function ChannelsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>(PLATFORMS);

  const connected = platforms.filter((p) => p.status === "connected");
  const total = platforms.filter((p) => p.status !== "coming_soon").length;

  const handleConnect = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "connected", connectedCount: 1 } : p
      )
    );
  };

  const handleDisconnect = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "disconnected", connectedCount: undefined } : p
      )
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Connected Channels</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your messaging platforms to communicate with leads from one place.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-foreground">{connected.length}<span className="text-muted-foreground text-base font-medium">/{total}</span></p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Channels active</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Connection coverage</span>
          <span className="font-semibold text-foreground">{Math.round((connected.length / total) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] transition-all duration-700"
            style={{ width: `${(connected.length / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Conversations", value: "127", color: "#3b82f6" },
          { label: "Unread Messages", value: "6", color: "#f59e0b" },
          { label: "Response Rate", value: "94%", color: "#10b981" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            <div className="mt-2 h-0.5 w-8 rounded-full" style={{ backgroundColor: stat.color }} />
          </div>
        ))}
      </div>

      {/* Platform grid */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-4">Messaging Platforms</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {platforms.map((p) => (
            <PlatformCard
              key={p.id}
              platform={p}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-4 flex items-start gap-3">
        <Zap className="h-4 w-4 text-[#3b82f6] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-foreground">More integrations coming soon</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            We&apos;re working on Shopee, Lazada, and Carousell integrations. Connect your store to auto-reply to product inquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
