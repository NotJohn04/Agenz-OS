"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Shield, User, Building2, CreditCard, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifs, setNotifs] = useState({ systemAlert: true, transactional: true, promotional: false, email: true });

  return (
    <div className="flex gap-6 max-w-[1000px]">
      {/* Tabs sidebar */}
      <div className="w-[200px] flex-shrink-0">
        <div className="space-y-0.5">
          {settingsTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors text-left",
                activeTab === tab.id ? "bg-[#3b82f6]/10 text-[#3b82f6] font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground">Profile Information</h2>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-xl font-bold text-white">
                FA
              </div>
              <div>
                <Button variant="outline" size="sm" className="rounded-xl text-xs h-8">Change Photo</Button>
                <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "First Name", value: "Faizal", id: "fn" },
                { label: "Last Name", value: "Azman", id: "ln" },
                { label: "Email", value: "faizal@solarpro.my", id: "email" },
                { label: "Phone", value: "+60 12-345 6789", id: "phone" },
              ].map(f => (
                <div key={f.id} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
                  <Input defaultValue={f.value} className="h-9 rounded-xl text-sm" />
                </div>
              ))}
            </div>
            <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl h-9 text-sm px-6">Save Changes</Button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { key: "systemAlert" as const, label: "System Alerts", desc: "CPL deviation, constraint reports. Rate limited to 7 days.", color: "#ef4444" },
                { key: "transactional" as const, label: "Transactional", desc: "Payment received, contract signed, module unlocked.", color: "#10b981" },
                { key: "promotional" as const, label: "Promotional", desc: "Offers, events, new packages. Email + soft banner only.", color: "#3b82f6" },
                { key: "email" as const, label: "Email Digest", desc: "Weekly summary of your KPIs and recommended actions.", color: "#8b5cf6" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full mt-1.5" style={{ backgroundColor: n.color }} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                  </div>
                  <Switch checked={notifs[n.key]} onCheckedChange={v => setNotifs(prev => ({ ...prev, [n.key]: v }))} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-[#3b82f6]" />
                    <p className="text-sm font-bold text-foreground">Beginner Package</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Active · Renews 1 March 2026</p>
                  <p className="text-2xl font-black text-[#3b82f6] mt-2">RM 1,500<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                </div>
                <Button variant="outline" className="rounded-xl text-xs h-8">Upgrade Plan</Button>
              </div>
              <Separator className="my-4" />
              <div className="space-y-1.5">
                {["Ads Performance Module", "Campaign Analytics Dashboard", "Constraint Diagnostic Report", "Industry Benchmark Engine"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#3b82f6]" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Payment History</h3>
              {[
                { date: "1 Feb 2026", amount: "RM 1,500", status: "Paid" },
                { date: "1 Jan 2026", amount: "RM 1,500", status: "Paid" },
                { date: "1 Dec 2025", amount: "RM 1,500", status: "Paid" },
              ].map(p => (
                <div key={p.date} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-foreground">Beginner Package</p>
                    <p className="text-[10px] text-muted-foreground">{p.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-foreground">{p.amount}</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appearance section (always visible) */}
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "dark", label: "Dark Mode", icon: Moon, desc: "Recommended for night work" },
                { value: "light", label: "Light Mode", icon: Sun, desc: "Clean daytime interface" },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn("rounded-xl border p-4 text-left transition-all",
                    theme === t.value ? "border-[#3b82f6] bg-[#3b82f6]/5" : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <t.icon className="h-4 w-4" style={{ color: theme === t.value ? "#3b82f6" : undefined }} />
                    <span className={cn("text-sm font-semibold", theme === t.value ? "text-[#3b82f6]" : "text-foreground")}>{t.label}</span>
                    {theme === t.value && <CheckCircle2 className="h-3.5 w-3.5 text-[#3b82f6] ml-auto" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
