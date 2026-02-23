"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Eye, X } from "lucide-react";
import { PACKAGE_CONFIG } from "@/lib/constants";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { viewingAs, setViewingAs, isViewingAs } = useAuth();
  const router = useRouter();

  function handleExitViewAs() {
    setViewingAs(null);
    router.push("/admin/clients");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* View As Banner */}
        {isViewingAs && viewingAs && (
          <div className="flex items-center justify-between px-5 py-2 bg-[#f59e0b]/10 border-b border-[#f59e0b]/20 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <Eye className="h-3.5 w-3.5 text-[#f59e0b]" />
              <span className="text-xs font-semibold text-[#f59e0b]">
                Viewing as <strong>{viewingAs.name}</strong> —{" "}
                {viewingAs.businessName}
              </span>
              <span className="text-[10px] text-[#f59e0b]/70 rounded-full bg-[#f59e0b]/10 px-2 py-0.5 border border-[#f59e0b]/20 font-medium">
                {PACKAGE_CONFIG[viewingAs.packageTier]?.label ?? viewingAs.packageTier} Plan
              </span>
            </div>
            <button
              onClick={handleExitViewAs}
              className="flex items-center gap-1.5 text-[11px] text-[#f59e0b]/70 hover:text-[#f59e0b] font-semibold transition-colors"
            >
              <X className="h-3 w-3" />
              Exit Admin View
            </button>
          </div>
        )}

        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LayoutInner>{children}</LayoutInner>
    </AuthProvider>
  );
}
