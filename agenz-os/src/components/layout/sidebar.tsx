"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Radio,
  Bot,
  Phone,
  Globe,
  Settings2,
  Trophy,
  Building2,
  ArrowUpCircle,
  GanttChartSquare,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Lock,
  Sparkles,
  BarChart3,
  Bell,
  Video,
  FileText,
  FileBarChart2,
  CreditCard,
  FilePen,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { mockClients } from "@/lib/mock-data";
import type { ModuleType } from "@/types";
import type { LucideProps } from "lucide-react";
import { PACKAGE_CONFIG } from "@/lib/constants";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<LucideProps>;
  badge?: string;
  badgeColor?: string;
  status?: "active" | "locked" | "addon" | "default";
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

// ─── Admin navigation (when no client is being impersonated) ─────────────────
const adminNavigation: NavGroup[] = [
  {
    group: "ADMIN PANEL",
    items: [
      { href: "/admin", label: "Overview", icon: BarChart3 },
      { href: "/admin/clients", label: "Clients", icon: Building2 },
      { href: "/admin/upgrade", label: "Upgrade Flow", icon: ArrowUpCircle },
      { href: "/admin/gantt", label: "Gantt Chart", icon: GanttChartSquare },
      { href: "/admin/financial", label: "Financial", icon: DollarSign },
      { href: "/admin/reports", label: "Reports", icon: FileBarChart2 },
      { href: "/admin/proposals", label: "Proposals", icon: FilePen },
      { href: "/admin/invoices", label: "Invoices", icon: CreditCard },
    ],
  },
  {
    group: "COMPETITION",
    items: [{ href: "/leaderboard", label: "Leaderboard", icon: Trophy }],
  },
  {
    group: "ACCOUNT",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

// ─── Module → nav item mapping ────────────────────────────────────────────────
const MODULE_NAV: Record<
  ModuleType,
  { href: string; label: string; icon: React.ComponentType<LucideProps> }
> = {
  ADS_PERFORMANCE: { href: "/modules/ads", label: "Ads Performance", icon: Target },
  SALES_OPTIMIZATION: { href: "/modules/sales", label: "Sales Optimization", icon: TrendingUp },
  INFLUENCER_MARKETING: { href: "/modules/scale", label: "Scale Mode", icon: Sparkles },
  AI_CHATBOT: { href: "/modules/chatbot", label: "AI Chatbot", icon: Bot },
  AI_CALLER: { href: "/modules/caller", label: "AI Caller", icon: Phone },
  WEBSITE: { href: "/modules/website", label: "Website", icon: Globe },
  CONTENT_CREATION: { href: "/modules/content", label: "Content", icon: FileText },
  AI_VIDEO: { href: "/modules/video", label: "AI Video", icon: Video },
  AUTOMATION: { href: "/modules/automation", label: "Automation", icon: Settings2 },
};

const MODULE_ORDER: ModuleType[] = [
  "ADS_PERFORMANCE",
  "SALES_OPTIMIZATION",
  "INFLUENCER_MARKETING",
  "AI_CHATBOT",
  "AI_CALLER",
  "WEBSITE",
  "CONTENT_CREATION",
  "AI_VIDEO",
  "AUTOMATION",
];

function buildClientNavigation(activeModules: ModuleType[]): NavGroup[] {
  const moduleItems: NavItem[] = MODULE_ORDER.map((m) => ({
    href: MODULE_NAV[m].href,
    label: MODULE_NAV[m].label,
    icon: MODULE_NAV[m].icon,
    status: activeModules.includes(m) ? "active" : "locked",
  }));

  return [
    {
      group: "MAIN",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/crm", label: "Pipeline", icon: KanbanSquare, badge: "12", badgeColor: "blue" },
        { href: "/crm/contacts", label: "Contacts", icon: Users },
        { href: "/conversations", label: "Conversations", icon: MessageSquare, badge: "5", badgeColor: "red" },
        { href: "/notifications", label: "Notifications", icon: Bell, badge: "2", badgeColor: "red" },
      ],
    },
    {
      group: "MODULES",
      items: moduleItems,
    },
    {
      group: "COMPETITION",
      items: [{ href: "/leaderboard", label: "Leaderboard", icon: Trophy }],
    },
    {
      group: "ACCOUNT",
      items: [
        { href: "/channels", label: "Channels", icon: Radio },
        { href: "/settings", label: "Settings", icon: Settings },
      ],
    },
  ];
}

const statusConfig = {
  active: {
    dot: "bg-emerald-400",
    glow: "shadow-[0_0_6px_rgba(16,185,129,0.6)]",
    badge: null,
  },
  locked: {
    dot: null,
    glow: null,
    badge: <Lock className="h-3 w-3 text-muted-foreground" />,
  },
  addon: {
    dot: "bg-purple-400",
    glow: "shadow-[0_0_6px_rgba(139,92,246,0.6)]",
    badge: null,
  },
  default: {
    dot: null,
    glow: null,
    badge: null,
  },
};

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (v: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { viewingAs, isViewingAs, currentUser } = useAuth();

  // Resolve the "effective client" — either admin impersonating, or logged-in client/employee
  const effectiveClient = isViewingAs && viewingAs
    ? viewingAs
    : (currentUser.role !== "ADMIN" && currentUser.clientId)
    ? mockClients.find((c) => c.id === currentUser.clientId) ?? null
    : null;

  const navigation = effectiveClient
    ? buildClientNavigation(effectiveClient.activeModules)
    : adminNavigation;

  // Footer user info — show actual logged-in user (not impersonated client)
  const footerUser = isViewingAs && viewingAs
    ? {
        initials: viewingAs.name.split(" ").map((n) => n[0]).join("").slice(0, 2),
        name: viewingAs.name,
        sub: viewingAs.businessName,
        tierLabel: PACKAGE_CONFIG[viewingAs.packageTier]?.label ?? viewingAs.packageTier,
        tierColor: PACKAGE_CONFIG[viewingAs.packageTier]?.color ?? "#3b82f6",
      }
    : {
        initials: currentUser.initials,
        name: currentUser.name,
        sub: currentUser.organization,
        tierLabel: currentUser.planLabel,
        tierColor: currentUser.planColor,
      };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[256px]"
      )}
    >
      {/* LOGO */}
      <div className="flex h-[64px] items-center justify-between px-3 border-b border-border">
        {!collapsed ? (
          <>
            <Link href={effectiveClient ? "/dashboard" : "/admin"} className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10">
                <Image src="/logo.png" alt="Agenz OS" width={44} height={44} className="h-9 w-9 object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[16px] font-black tracking-[0.1em] text-foreground uppercase">AGENZ OS</span>
                <span className="text-[9px] font-semibold tracking-widest text-[#3b82f6] uppercase mt-0.5">Control Tower</span>
              </div>
            </Link>
            <button
              onClick={() => onCollapse?.(!collapsed)}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 w-full">
            <Link href={effectiveClient ? "/dashboard" : "/admin"} className="flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10">
              <Image src="/logo.png" alt="Agenz OS" width={44} height={44} className="h-9 w-9 object-contain" />
            </Link>
            <button
              onClick={() => onCollapse?.(!collapsed)}
              className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navigation.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const isLocked = item.status === "locked";
                const config = statusConfig[item.status ?? "default"];

                return (
                  <Link
                    key={item.href}
                    href={isLocked ? "#" : item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                      isActive
                        ? "bg-[#3b82f6]/10 text-[#3b82f6] font-medium"
                        : isLocked
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={isLocked ? (e) => e.preventDefault() : undefined}
                  >
                    {/* Active indicator */}
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[#3b82f6]" />
                    )}

                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <item.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActive && "text-[#3b82f6]",
                          isLocked && "opacity-40"
                        )}
                      />
                      {config.dot && (
                        <div
                          className={cn(
                            "absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full",
                            config.dot,
                            config.glow
                          )}
                        />
                      )}
                    </div>

                    {/* Label + badges */}
                    {!collapsed && (
                      <span className="flex-1 truncate text-[13px]">{item.label}</span>
                    )}

                    {/* Count badge */}
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                          item.badgeColor === "red"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-[#3b82f6]/15 text-[#3b82f6]"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Lock icon */}
                    {!collapsed && config.badge && (
                      <span className="ml-auto">{config.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* USER FOOTER */}
      <div className="border-t border-border p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer">
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                  isViewingAs
                    ? "bg-gradient-to-br from-[#f59e0b] to-[#f59e0b]/70"
                    : "bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]"
                )}
              >
                {footerUser.initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">{footerUser.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{footerUser.sub}</p>
            </div>
            <Badge
              className="flex-shrink-0 text-[9px] h-4 px-1.5 font-semibold border"
              style={{
                backgroundColor: `${footerUser.tierColor}15`,
                color: footerUser.tierColor,
                borderColor: `${footerUser.tierColor}30`,
              }}
            >
              {footerUser.tierLabel}
            </Badge>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                  isViewingAs
                    ? "bg-gradient-to-br from-[#f59e0b] to-[#f59e0b]/70"
                    : "bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6]"
                )}
              >
                {footerUser.initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-emerald-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
