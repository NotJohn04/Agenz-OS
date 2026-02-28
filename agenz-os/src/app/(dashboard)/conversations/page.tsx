"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Send,
  Check,
  CheckCheck,
  RefreshCw,
  Lock,
  Smartphone,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  X,
  QrCode,
  MessageSquare,
  ChevronRight,
  Radio,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Platform = "whatsapp" | "instagram" | "facebook" | "telegram" | "tiktok";

interface Message {
  id: string;
  text: string;
  from: "agent" | "lead";
  time: string;
  status?: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  name: string;
  company: string;
  initials: string;
  platform: Platform;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

// ─── Platform config ────────────────────────────────────────────────────────────
const PLATFORM: Record<Platform, { label: string; color: string; abbr: string }> = {
  whatsapp:  { label: "WhatsApp",           color: "#25D366", abbr: "WA" },
  instagram: { label: "Instagram",          color: "#E1306C", abbr: "IG" },
  facebook:  { label: "Facebook Messenger", color: "#0084FF", abbr: "FB" },
  telegram:  { label: "Telegram",           color: "#0088cc", abbr: "TG" },
  tiktok:    { label: "TikTok",             color: "#fe2c55", abbr: "TT" },
};

// ─── Mock conversations ─────────────────────────────────────────────────────────
const MOCK_CONVS: Conversation[] = [
  {
    id: "c1",
    name: "Faizal Azman",
    company: "Solar Pro Malaysia",
    initials: "FA",
    platform: "whatsapp",
    lastMessage: "Bila boleh proceed dengan installation?",
    time: "2m",
    unread: 3,
    messages: [
      { id: "m1", text: "Hi, I saw your ad about solar panels. Interested to know more!", from: "lead", time: "10:30 AM" },
      { id: "m2", text: "Great to hear that! Which area are you located?", from: "agent", time: "10:32 AM", status: "read" },
      { id: "m3", text: "Subang Jaya. How much for a 3kW system?", from: "lead", time: "10:33 AM" },
      { id: "m4", text: "3kW starts from RM 12,800 with 10-year warranty. Want a free site visit?", from: "agent", time: "10:35 AM", status: "read" },
      { id: "m5", text: "Yes please! Can you come this weekend?", from: "lead", time: "10:36 AM" },
      { id: "m6", text: "Bila boleh proceed dengan installation?", from: "lead", time: "2:15 PM" },
    ],
  },
  {
    id: "c2",
    name: "Nurul Hana",
    company: "Bunga House KL",
    initials: "NH",
    platform: "instagram",
    lastMessage: "Love your flower arrangements! 😍",
    time: "15m",
    unread: 1,
    messages: [],
  },
  {
    id: "c3",
    name: "Marcus Tan",
    company: "TechMart Online",
    initials: "MT",
    platform: "facebook",
    lastMessage: "Can we discuss the proposal?",
    time: "1h",
    unread: 0,
    messages: [],
  },
  {
    id: "c4",
    name: "Ahmad Razif",
    company: "FitLife Studio",
    initials: "AR",
    platform: "telegram",
    lastMessage: "Send me the pricing list please",
    time: "3h",
    unread: 2,
    messages: [],
  },
  {
    id: "c5",
    name: "Siti Aisyah",
    company: "GreenEats Cafe",
    initials: "SA",
    platform: "tiktok",
    lastMessage: "Saw your TikTok ad, interested!",
    time: "1d",
    unread: 0,
    messages: [],
  },
  {
    id: "c6",
    name: "Hafiz Rahman",
    company: "Rahman Auto",
    initials: "HR",
    platform: "whatsapp",
    lastMessage: "Nak tau lebih pasal pakej tu",
    time: "2d",
    unread: 0,
    messages: [],
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
  const cell = 8;
  const total = 21 * cell;
  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl inline-block">
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

// ─── Platform badge ─────────────────────────────────────────────────────────────
function PlatformPill({ platform }: { platform: Platform }) {
  const p = PLATFORM[platform];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
      style={{ backgroundColor: p.color }}
    >
      {p.abbr}
    </span>
  );
}

// ─── Conversation list item ─────────────────────────────────────────────────────
function ConvListItem({
  conv,
  isSelected,
  isConnected,
  onClick,
}: {
  conv: Conversation;
  isSelected: boolean;
  isConnected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150",
        isSelected
          ? "bg-[#3b82f6]/10 ring-1 ring-[#3b82f6]/20"
          : "hover:bg-muted"
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-bold",
            isConnected
              ? "bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white"
              : "bg-muted text-muted-foreground"
          )}
        >
          {conv.initials}
        </div>
        <div className="absolute -bottom-0.5 -right-1">
          <PlatformPill platform={conv.platform} />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center justify-between gap-1">
          <span className={cn(
            "text-[13px] font-semibold truncate",
            isSelected ? "text-[#3b82f6]" : "text-foreground"
          )}>
            {conv.name}
          </span>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">{conv.time}</span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span className="text-[11px] text-muted-foreground truncate">
            {isConnected ? conv.lastMessage : (
              <span className="flex items-center gap-1 text-muted-foreground/50">
                <Lock className="h-2.5 w-2.5" /> Scan QR to unlock
              </span>
            )}
          </span>
          {conv.unread > 0 && isConnected && (
            <span
              className="flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
              style={{ backgroundColor: PLATFORM[conv.platform].color }}
            >
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── QR connect panel ───────────────────────────────────────────────────────────
function QRConnectPanel({
  conv,
  onConnect,
  isScanning,
  onStartScan,
}: {
  conv: Conversation;
  onConnect: () => void;
  isScanning: boolean;
  onStartScan: () => void;
}) {
  const p = PLATFORM[conv.platform];
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 gap-8">
      {/* Contact header */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 text-xl font-bold text-foreground ring-1 ring-border">
          {conv.initials}
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-foreground">{conv.name}</p>
          <p className="text-sm text-muted-foreground">{conv.company}</p>
          <div
            className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
            style={{ backgroundColor: p.color }}
          >
            {p.label}
          </div>
        </div>
      </div>

      {/* QR code + instructions */}
      {!isScanning ? (
        <div className="flex flex-col items-center gap-5 text-center max-w-sm">
          <div className="rounded-3xl border border-border bg-muted/30 p-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <QrCode className="h-4 w-4 text-[#3b82f6]" />
              Connect via {p.label}
            </div>

            <QRCodeSVG />

            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Open <span className="font-semibold text-foreground">{p.label}</span> on your phone,<br />
                go to <span className="font-semibold text-foreground">Linked Devices</span> and scan this QR code.
              </p>
              <p className="text-[10px] text-muted-foreground/60">QR code refreshes every 60 seconds</p>
            </div>
          </div>

          {/* Steps */}
          <div className="w-full space-y-2">
            {[
              { step: "1", text: `Open ${p.label} on your phone` },
              { step: "2", text: "Tap Menu → Linked Devices → Link a Device" },
              { step: "3", text: "Point your phone camera at this QR code" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3 text-left">
                <div
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {step}
                </div>
                <span className="text-[11px] text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Demo: simulate scan */}
          <Button
            size="sm"
            className="w-full text-xs"
            style={{ backgroundColor: p.color, color: "white" }}
            onClick={onStartScan}
          >
            <Smartphone className="h-3.5 w-3.5 mr-1.5" />
            Simulate QR Scan (Demo)
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full animate-pulse"
              style={{ backgroundColor: `${p.color}20` }}
            >
              <RefreshCw className="h-8 w-8 animate-spin" style={{ color: p.color }} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Connecting to {p.label}…</p>
            <p className="text-xs text-muted-foreground mt-1">Verifying QR code scan</p>
          </div>
          <button
            onClick={onConnect}
            className="text-xs text-[#3b82f6] hover:underline"
          >
            Skip wait (Demo)
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Chat panel ─────────────────────────────────────────────────────────────────
function ChatPanel({ conv, messages, onSend }: {
  conv: Conversation;
  messages: Message[];
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const t = input.trim();
    if (!t) return;
    onSend(t);
    setInput("");
  };

  const p = PLATFORM[conv.platform];

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-[11px] font-bold text-white">
              {conv.initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{conv.name}</p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-muted-foreground">
                Connected via <span className="font-medium" style={{ color: p.color }}>{p.label}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Phone className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Video className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.from === "agent" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                msg.from === "agent"
                  ? "rounded-br-md text-white"
                  : "rounded-bl-md bg-muted text-foreground"
              )}
              style={msg.from === "agent" ? { backgroundColor: p.color } : undefined}
            >
              <p>{msg.text}</p>
              <div className={cn(
                "flex items-center gap-1 mt-1",
                msg.from === "agent" ? "justify-end" : "justify-start"
              )}>
                <span className={cn(
                  "text-[9px]",
                  msg.from === "agent" ? "text-white/60" : "text-muted-foreground"
                )}>
                  {msg.time}
                </span>
                {msg.from === "agent" && msg.status === "read" && (
                  <CheckCheck className="h-2.5 w-2.5 text-white/80" />
                )}
                {msg.from === "agent" && msg.status === "delivered" && (
                  <CheckCheck className="h-2.5 w-2.5 text-white/50" />
                )}
                {msg.from === "agent" && msg.status === "sent" && (
                  <Check className="h-2.5 w-2.5 text-white/50" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/50 px-3 py-2">
          <button className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${conv.name}…`}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1 leading-relaxed"
            style={{ maxHeight: 100 }}
          />
          <button className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <Smile className="h-4 w-4" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-white transition-all disabled:opacity-30"
            style={{ backgroundColor: p.color }}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3b82f6]/10">
        <MessageSquare className="h-8 w-8 text-[#3b82f6]" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">Select a conversation</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Click on a lead to start messaging. Scan the QR code to connect your platform.
        </p>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function ConversationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Platform>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // c1 is pre-connected to simulate one active conversation
  const [connected, setConnected] = useState<Set<string>>(new Set(["c1"]));
  const [scanning, setScanning] = useState<string | null>(null);
  const [messageStore, setMessageStore] = useState<Record<string, Message[]>>(() => {
    const init: Record<string, Message[]> = {};
    MOCK_CONVS.forEach((c) => { init[c.id] = [...c.messages]; });
    return init;
  });

  const filtered = MOCK_CONVS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.platform === filter;
    return matchSearch && matchFilter;
  });

  const selected = MOCK_CONVS.find((c) => c.id === selectedId) ?? null;
  const isConnected = selectedId ? connected.has(selectedId) : false;
  const isScanning = selectedId === scanning;

  const handleStartScan = () => {
    if (!selectedId) return;
    setScanning(selectedId);
    setTimeout(() => {
      setConnected((prev) => new Set([...prev, selectedId]));
      setScanning(null);
    }, 2500);
  };

  const handleConnect = () => {
    if (!selectedId) return;
    setConnected((prev) => new Set([...prev, selectedId]));
    setScanning(null);
  };

  const handleSend = (text: string) => {
    if (!selectedId) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
    const msg: Message = {
      id: `msg-${Date.now()}`,
      text,
      from: "agent",
      time: timeStr,
      status: "sent",
    };
    setMessageStore((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), msg],
    }));
  };

  const platforms: ("all" | Platform)[] = ["all", "whatsapp", "instagram", "facebook", "telegram", "tiktok"];

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* ── Left panel ── */}
      <div className="flex w-[300px] flex-shrink-0 flex-col border-r border-border bg-background">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-foreground">Conversations</h1>
            <Badge className="bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20 text-[10px]">
              {MOCK_CONVS.reduce((s, c) => s + c.unread, 0)} unread
            </Badge>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full rounded-lg border border-border bg-muted/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6]/40"
            />
          </div>
          {/* Platform filter */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none pb-0.5">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={cn(
                  "flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all",
                  filter === p
                    ? "bg-[#3b82f6] text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {p === "all" ? "All" : PLATFORM[p].abbr}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filtered.map((conv) => (
            <ConvListItem
              key={conv.id}
              conv={conv}
              isSelected={selectedId === conv.id}
              isConnected={connected.has(conv.id)}
              onClick={() => setSelectedId(conv.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No conversations found</div>
          )}
        </div>

        {/* Connect more channels CTA */}
        <div className="border-t border-border p-3">
          <a
            href="/channels"
            className="flex items-center justify-between rounded-xl border border-dashed border-border px-3 py-2.5 hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#3b82f6]" />
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                Connect more channels
              </span>
            </div>
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-[#3b82f6]" />
          </a>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col bg-background min-w-0">
        {!selected && <EmptyState />}
        {selected && !isConnected && (
          <QRConnectPanel
            conv={selected}
            onConnect={handleConnect}
            isScanning={isScanning}
            onStartScan={handleStartScan}
          />
        )}
        {selected && isConnected && (
          <ChatPanel
            conv={selected}
            messages={messageStore[selected.id] ?? []}
            onSend={handleSend}
          />
        )}
      </div>
    </div>
  );
}
