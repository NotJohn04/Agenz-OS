"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Bell, Sun, Moon, ChevronRight, AlertTriangle, X, Users, ShieldCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth, MOCK_USERS } from "@/lib/auth-context";
import type { AppUser } from "@/lib/auth-context";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/crm": "Pipeline",
  "/crm/contacts": "Contacts",
  "/modules/ads": "Ads Performance",
  "/modules/sales": "Sales Optimization",
  "/modules/scale": "Scale Mode",
  "/modules/chatbot": "AI Chatbot",
  "/modules/caller": "AI Caller",
  "/modules/website": "Website",
  "/modules/automation": "Automation",
  "/leaderboard": "Leaderboard",
  "/notifications": "Notifications",
  "/admin": "Admin Overview",
  "/admin/clients": "Clients",
  "/admin/upgrade": "Upgrade Flow",
  "/admin/gantt": "Gantt Chart",
  "/admin/financial": "Financial",
  "/settings": "Settings",
  "/conversations": "Conversations",
  "/channels": "Channels",
};

function getBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    crumbs.push({
      label: breadcrumbMap[current] ?? part.charAt(0).toUpperCase() + part.slice(1),
      href: current,
    });
  }
  return crumbs;
}

function roleIcon(role: AppUser["role"]) {
  if (role === "ADMIN") return <ShieldCheck className="h-3 w-3" />;
  if (role === "CLIENT_EMPLOYEE") return <Briefcase className="h-3 w-3" />;
  return <Users className="h-3 w-3" />;
}

function roleLabel(role: AppUser["role"]) {
  if (role === "ADMIN") return "Admin";
  if (role === "CLIENT_EMPLOYEE") return "Employee";
  return "Client";
}

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showAlert, setShowAlert] = useState(true);
  const { currentUser, setCurrentUser, viewingAs, isViewingAs } = useAuth();
  const breadcrumbs = getBreadcrumbs(pathname);

  const isAdminPage = pathname.startsWith("/admin");

  // Group users by role for the switcher
  const adminUsers = MOCK_USERS.filter((u) => u.role === "ADMIN");
  const clientUsers = MOCK_USERS.filter((u) => u.role === "CLIENT");
  const employeeUsers = MOCK_USERS.filter((u) => u.role === "CLIENT_EMPLOYEE");

  // Displayed user: if admin is viewing as a client, the top-right still shows the admin
  // The View As banner already shows who they're impersonating
  const displayUser = currentUser;

  return (
    <div className="flex flex-col">
      {/* Constraint Alert Banner — only on client-facing pages */}
      {showAlert && !isAdminPage && (
        <div className="flex items-center gap-3 bg-red-500/10 border-b border-red-500/20 px-6 py-2.5 text-sm">
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-semibold text-[12px]">CONSTRAINT DETECTED</span>
          </div>
          <span className="text-red-700 dark:text-red-300/80 text-[12px]">
            Your CPL (RM 34) is{" "}
            <strong className="text-red-700 dark:text-red-200">2.4x above</strong> the Solar
            Energy industry standard (RM 10–20). Estimated revenue loss:{" "}
            <strong className="text-red-700 dark:text-red-200">RM 18,000/month</strong>.
          </span>
          <Link
            href="/modules/ads"
            className="ml-auto flex-shrink-0 rounded-md bg-red-500/15 px-3 py-1 text-[11px] font-semibold text-red-600 dark:text-red-300 hover:bg-red-500/25 transition-colors border border-red-500/25"
          >
            Fix Now →
          </Link>
          <button
            onClick={() => setShowAlert(false)}
            className="flex-shrink-0 text-red-500/60 hover:text-red-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <header className="flex h-[56px] items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-1 min-w-0">
          <span className="hidden sm:block">Agenz OS</span>
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
              {i === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-foreground truncate">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground transition-colors truncate">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  2
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="destructive" className="text-[10px] h-4">2 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-semibold text-red-400">Critical Alert</span>
                </div>
                <p className="text-xs text-muted-foreground pl-3.5">
                  CPL 2.4x above industry standard — RM 18K/month loss
                </p>
                <p className="text-[10px] text-muted-foreground/60 pl-3.5">2 hours ago</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
                  <span className="text-xs font-semibold">Promotional</span>
                </div>
                <p className="text-xs text-muted-foreground pl-3.5">
                  Advanced Package: Businesses grew 67% avg in 90 days
                </p>
                <p className="text-[10px] text-muted-foreground/60 pl-3.5">7 days ago</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="w-full justify-center text-xs text-[#3b82f6] cursor-pointer">
                  View all notifications →
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu — shows the actual logged-in user, not the impersonated one */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{
                    background:
                      displayUser.role === "ADMIN"
                        ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                        : displayUser.role === "CLIENT_EMPLOYEE"
                        ? "linear-gradient(135deg, #6b7280, #4b5563)"
                        : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  }}
                >
                  {displayUser.initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-foreground">{displayUser.name}</p>
                  <p className="text-[10px] text-muted-foreground">{displayUser.organization}</p>
                </div>
                {/* Role badge */}
                <span
                  className="hidden sm:flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold border"
                  style={{
                    backgroundColor: `${displayUser.planColor}15`,
                    color: displayUser.planColor,
                    borderColor: `${displayUser.planColor}30`,
                  }}
                >
                  {roleIcon(displayUser.role)}
                  {displayUser.planLabel}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Current user info */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      background:
                        displayUser.role === "ADMIN"
                          ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                          : displayUser.role === "CLIENT_EMPLOYEE"
                          ? "linear-gradient(135deg, #6b7280, #4b5563)"
                          : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                    }}
                  >
                    {displayUser.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {displayUser.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {displayUser.organization}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[9px] font-semibold" style={{ color: displayUser.planColor }}>
                        {roleLabel(displayUser.role)} · {displayUser.planLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              {displayUser.role === "ADMIN" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {/* Switch account (demo feature) */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-xs">
                  <Users className="h-3.5 w-3.5 mr-2" />
                  Switch Account
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  {/* Admin accounts */}
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold py-1">
                    Agenz Team (Admin)
                  </DropdownMenuLabel>
                  {adminUsers.map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => setCurrentUser(u)}
                      className={cn(
                        "gap-2 text-xs",
                        currentUser.id === u.id && "bg-[#3b82f6]/10 text-[#3b82f6]"
                      )}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] text-[9px] font-bold text-white flex-shrink-0">
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{u.name}</p>
                      </div>
                      {currentUser.id === u.id && (
                        <span className="ml-auto text-[9px] font-bold text-[#3b82f6]">Active</span>
                      )}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  {/* Client accounts */}
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold py-1">
                    Clients
                  </DropdownMenuLabel>
                  {clientUsers.map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => setCurrentUser(u)}
                      className={cn(
                        "gap-2 text-xs",
                        currentUser.id === u.id && "bg-[#8b5cf6]/10 text-[#8b5cf6]"
                      )}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-[9px] font-bold text-white flex-shrink-0">
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{u.organization}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  {/* Employee accounts */}
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold py-1">
                    Client Employees
                  </DropdownMenuLabel>
                  {employeeUsers.map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => setCurrentUser(u)}
                      className={cn(
                        "gap-2 text-xs",
                        currentUser.id === u.id && "bg-muted"
                      )}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#6b7280] to-[#4b5563] text-[9px] font-bold text-white flex-shrink-0">
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{u.organization}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {isViewingAs && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-[#f59e0b] text-xs">
                    Currently impersonating a client
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="text-red-500 dark:text-red-400">
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
}
