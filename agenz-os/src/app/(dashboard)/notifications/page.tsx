import { mockNotifications } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle2, Megaphone, Bell, Zap } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";
import Link from "next/link";

const typeConfig: Record<NotificationType, { icon: React.ComponentType<LucideProps>, color: string, bg: string, label: string }> = {
  SYSTEM_ALERT: { icon: AlertTriangle, color: "#ef4444", bg: "bg-red-500/10 border-red-500/20", label: "System Alert" },
  TRANSACTIONAL: { icon: CheckCircle2, color: "#10b981", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Transactional" },
  PROMOTIONAL: { icon: Megaphone, color: "#3b82f6", bg: "bg-blue-500/10 border-blue-500/20", label: "Promotional" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function NotificationsPage() {
  const unread = mockNotifications.filter(n => !n.isRead).length;
  const grouped = {
    SYSTEM_ALERT: mockNotifications.filter(n => n.type === "SYSTEM_ALERT"),
    TRANSACTIONAL: mockNotifications.filter(n => n.type === "TRANSACTIONAL"),
    PROMOTIONAL: mockNotifications.filter(n => n.type === "PROMOTIONAL"),
  };

  return (
    <div className="space-y-5 max-w-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-foreground" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{unread} unread · {mockNotifications.length} total</p>
          </div>
        </div>
        <button className="text-xs text-[#3b82f6] hover:text-[#06b6d4] font-medium transition-colors">
          Mark all as read
        </button>
      </div>

      {/* Notification type breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(typeConfig) as [NotificationType, typeof typeConfig[NotificationType]][]).map(([type, conf]) => (
          <div key={type} className={cn("rounded-xl border p-3.5", conf.bg)}>
            <div className="flex items-center gap-2 mb-1">
              <conf.icon className="h-3.5 w-3.5" style={{ color: conf.color }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: conf.color }}>{conf.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{grouped[type].length}</p>
            <p className="text-[10px] text-muted-foreground">{grouped[type].filter(n => !n.isRead).length} unread</p>
          </div>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {mockNotifications.map(notif => {
          const conf = typeConfig[notif.type];
          return (
            <div
              key={notif.id}
              className={cn(
                "relative rounded-2xl border p-5 transition-colors",
                !notif.isRead ? cn(conf.bg, "shadow-sm") : "border-border bg-card opacity-70"
              )}
            >
              {/* Unread indicator */}
              {!notif.isRead && (
                <div className="absolute right-4 top-4 h-2 w-2 rounded-full" style={{ backgroundColor: conf.color }} />
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${conf.color}15` }}
                >
                  <conf.icon className="h-5 w-5" style={{ color: conf.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Badge + date */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${conf.color}15`, color: conf.color }}
                    >
                      {conf.label}
                    </span>
                    {notif.priority === "high" && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
                        High Priority
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <p className="text-sm font-semibold text-foreground mb-1">{notif.title}</p>

                  {/* Message */}
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>

                  {/* Constraint specific info */}
                  {notif.rmImpact && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        RM {notif.rmImpact.toLocaleString()}/month impact
                      </div>
                      {notif.recommendedModule && (
                        <Link
                          href="/modules/ads"
                          className="flex items-center gap-1.5 rounded-lg bg-[#3b82f6]/10 px-2.5 py-1 text-xs font-semibold text-[#3b82f6] hover:bg-[#3b82f6]/20 transition-colors"
                        >
                          <Zap className="h-3 w-3" />
                          View Module →
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  <p className="mt-2 text-[10px] text-muted-foreground/60">{formatDate(notif.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
