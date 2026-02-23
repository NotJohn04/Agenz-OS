import type { ConstraintType, LeadStage, ModuleType, PackageTier, HealthStatus } from "@/types";

// ============================================================
// AGENZ OS — Constants & Config
// ============================================================

export const BRAND_COLORS = {
  blue: "#3B82F6",
  cyan: "#06B6D4",
  purple: "#8B5CF6",
  light: "#F5F5F5",
  dark: "#0A0A0A",
  red: "#EF4444",
  orange: "#F97316",
  green: "#10B981",
  yellow: "#F59E0B",
  pink: "#EC4899",
} as const;

export const STATUS_COLORS: Record<string, string> = {
  good: "#10B981",
  warning: "#F97316",
  critical: "#EF4444",
  excellent: "#3B82F6",
  neutral: "#6B7280",
};

export const HEALTH_STATUS_CONFIG: Record<HealthStatus, { color: string; bgClass: string; label: string }> = {
  EXCELLENT: { color: "#3B82F6", bgClass: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Excellent" },
  GOOD: { color: "#10B981", bgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Good" },
  WARNING: { color: "#F97316", bgClass: "bg-orange-500/10 text-orange-400 border-orange-500/20", label: "At Risk" },
  CRITICAL: { color: "#EF4444", bgClass: "bg-red-500/10 text-red-400 border-red-500/20", label: "Critical" },
};

export const LEAD_STAGE_CONFIG: Record<LeadStage, { label: string; color: string; bgColor: string }> = {
  NEW_LEAD: { label: "New Lead", color: "#6B7280", bgColor: "bg-gray-500/10 text-gray-400" },
  CONTACTED: { label: "Contacted", color: "#3B82F6", bgColor: "bg-blue-500/10 text-blue-400" },
  QUALIFIED: { label: "Qualified", color: "#06B6D4", bgColor: "bg-cyan-500/10 text-cyan-400" },
  PROPOSAL: { label: "Proposal", color: "#8B5CF6", bgColor: "bg-purple-500/10 text-purple-400" },
  NEGOTIATION: { label: "Negotiation", color: "#F59E0B", bgColor: "bg-amber-500/10 text-amber-400" },
  WON: { label: "Won", color: "#10B981", bgColor: "bg-emerald-500/10 text-emerald-400" },
  LOST: { label: "Lost", color: "#EF4444", bgColor: "bg-red-500/10 text-red-400" },
};

export const MODULE_CONFIG: Record<ModuleType, { label: string; description: string; color: string; icon: string }> = {
  ADS_PERFORMANCE: {
    label: "Ads Performance",
    description: "Lead generation via paid advertising",
    color: "#3B82F6",
    icon: "Target",
  },
  SALES_OPTIMIZATION: {
    label: "Sales Optimization",
    description: "Stage heatmap, close rate improvement",
    color: "#06B6D4",
    icon: "TrendingUp",
  },
  INFLUENCER_MARKETING: {
    label: "Influencer Marketing",
    description: "Influencer pipeline and ROI tracking",
    color: "#8B5CF6",
    icon: "Users",
  },
  CONTENT_CREATION: {
    label: "Content Creation",
    description: "Posts, views, engagement tracking",
    color: "#EC4899",
    icon: "FileText",
  },
  AI_VIDEO: {
    label: "AI Video",
    description: "AI-generated video content",
    color: "#F59E0B",
    icon: "Video",
  },
  WEBSITE: {
    label: "Website",
    description: "Traffic, conversion, bounce rate",
    color: "#10B981",
    icon: "Globe",
  },
  AI_CHATBOT: {
    label: "AI Chatbot",
    description: "Conversation automation, lead qualification",
    color: "#06B6D4",
    icon: "Bot",
  },
  AI_CALLER: {
    label: "AI Caller",
    description: "Automated outreach and appointment booking",
    color: "#F97316",
    icon: "Phone",
  },
  AUTOMATION: {
    label: "Automation",
    description: "Workflow sequences and follow-up",
    color: "#8B5CF6",
    icon: "Zap",
  },
};

export const PACKAGE_CONFIG: Record<PackageTier, { label: string; modules: ModuleType[]; price: number; color: string }> = {
  NONE: { label: "Free", modules: [], price: 0, color: "#6B7280" },
  BEGINNER: {
    label: "Beginner",
    modules: ["ADS_PERFORMANCE"],
    price: 1500,
    color: "#3B82F6",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    modules: ["ADS_PERFORMANCE", "SALES_OPTIMIZATION"],
    price: 3000,
    color: "#06B6D4",
  },
  ADVANCED: {
    label: "Advanced",
    modules: ["ADS_PERFORMANCE", "SALES_OPTIMIZATION", "INFLUENCER_MARKETING", "CONTENT_CREATION", "AI_VIDEO"],
    price: 5500,
    color: "#8B5CF6",
  },
  AI_CHATBOT: { label: "AI Chatbot Add-on", modules: ["AI_CHATBOT"], price: 800, color: "#06B6D4" },
  AI_CALLER: { label: "AI Caller Add-on", modules: ["AI_CALLER"], price: 1200, color: "#F97316" },
  WEBSITE: { label: "Website Add-on", modules: ["WEBSITE"], price: 2000, color: "#10B981" },
  AUTOMATION: { label: "Automation Add-on", modules: ["AUTOMATION"], price: 600, color: "#8B5CF6" },
  CUSTOM: { label: "Custom Bundle", modules: [], price: 0, color: "#EC4899" },
};

export const CONSTRAINT_CONFIG: Record<ConstraintType, { label: string; description: string; color: string }> = {
  CPL_TOO_HIGH: {
    label: "CPL Too High",
    description: "Cost per lead exceeds industry benchmark",
    color: "#EF4444",
  },
  CONVERSION_TOO_LOW: {
    label: "Conversion Too Low",
    description: "Close rate below market standard",
    color: "#EF4444",
  },
  LTV_TOO_LOW: {
    label: "LTV Too Low",
    description: "Lifetime value below optimal range",
    color: "#F97316",
  },
  INSUFFICIENT_LEADS: {
    label: "Insufficient Leads",
    description: "Lead volume not meeting growth targets",
    color: "#F97316",
  },
  SLOW_RESPONSE_TIME: {
    label: "Slow Response Time",
    description: "Response time causing lead drop-off",
    color: "#F59E0B",
  },
  WEAK_BRAND_PRESENCE: {
    label: "Weak Brand Presence",
    description: "Low brand awareness reducing organic leads",
    color: "#F59E0B",
  },
  HIGH_CHURN: {
    label: "High Churn",
    description: "Customer retention below benchmark",
    color: "#EF4444",
  },
  SHORT_PAYBACK_PERIOD: {
    label: "Short Payback Period",
    description: "CAC recovery time too long",
    color: "#F97316",
  },
};

export const CHART_COLORS = [
  "#3B82F6",
  "#06B6D4",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#F97316",
];

export const PIPELINE_STAGES: LeadStage[] = [
  "NEW_LEAD",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
];

export const INDUSTRIES = [
  "Solar Energy",
  "Florist",
  "E-commerce",
  "F&B",
  "Fitness",
  "Real Estate",
  "Education",
  "Healthcare",
  "Automotive",
  "Fashion",
  "Technology",
  "Financial Services",
];
