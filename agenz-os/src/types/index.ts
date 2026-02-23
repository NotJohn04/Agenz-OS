// ============================================================
// AGENZ OS — TypeScript Types
// ============================================================

export type Role = "FREE_CLIENT" | "PAID_CLIENT" | "ADMIN";
export type PackageTier =
  | "NONE"
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "AI_CHATBOT"
  | "AI_CALLER"
  | "WEBSITE"
  | "AUTOMATION"
  | "CUSTOM";

export type ModuleType =
  | "ADS_PERFORMANCE"
  | "SALES_OPTIMIZATION"
  | "INFLUENCER_MARKETING"
  | "CONTENT_CREATION"
  | "AI_VIDEO"
  | "WEBSITE"
  | "AI_CHATBOT"
  | "AI_CALLER"
  | "AUTOMATION";

export type ConstraintType =
  | "CPL_TOO_HIGH"
  | "CONVERSION_TOO_LOW"
  | "LTV_TOO_LOW"
  | "INSUFFICIENT_LEADS"
  | "SLOW_RESPONSE_TIME"
  | "WEAK_BRAND_PRESENCE"
  | "HIGH_CHURN"
  | "SHORT_PAYBACK_PERIOD";

export type LeadStage =
  | "NEW_LEAD"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type NotificationType = "SYSTEM_ALERT" | "TRANSACTIONAL" | "PROMOTIONAL";

export type HealthStatus = "CRITICAL" | "WARNING" | "GOOD" | "EXCELLENT";

export interface Client {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  industry: string;
  packageTier: PackageTier;
  role: Role;
  healthScore: number; // 0-100
  healthStatus: HealthStatus;
  activeModules: ModuleType[];
  baselineCaptured: boolean;
  baselineDate?: string;
  contractSigned: boolean;
  paymentConfirmed: boolean;
  joinedAt: string;
  avatar?: string;
}

export interface BaselineSnapshot {
  id: string;
  tenantId: string;
  capturedAt: string;
  avgRevenueRM: number;
  avgProfitRM: number;
  avgCAC: number;
  avgLTV: number;
  avgConversionRate: number;
  avgCPL: number;
  avgChurn: number;
  avgLeads: number;
  avgROAS: number;
  isImmutable: boolean;
}

export interface KPIMetric {
  label: string;
  value: number | string;
  unit: string;
  baseline: number;
  delta: number; // percentage change from baseline
  trend: "up" | "down" | "flat";
  status: "good" | "warning" | "critical";
  industryMin?: number;
  industryMax?: number;
  sparklineData?: number[];
}

export interface IndustryBenchmark {
  industry: string;
  geography: string;
  cplMin: number;
  cplMax: number;
  cacMin: number;
  cacMax: number;
  closeRateMin: number;
  closeRateMax: number;
  roasMin: number;
  roasMax: number;
  ltvMin: number;
  ltvMax: number;
  churnMax: number;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: LeadStage;
  dealValue: number;
  source: string;
  industry: string;
  daysInStage: number;
  assignedAgent: string;
  lastContact: string;
  createdAt: string;
  notes?: string;
}

export interface PipelineStage {
  stage: LeadStage;
  label: string;
  count: number;
  totalValue: number;
  leads: Lead[];
  color: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: "ACTIVE" | "PAUSED" | "ENDED";
  budget: number;
  spent: number;
  leads: number;
  cpl: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
  startDate: string;
  endDate?: string;
}

export interface ModuleResult {
  moduleId: ModuleType;
  month: string;
  metrics: Record<string, number>;
  deltaVsBaseline: Record<string, number>;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  constraintType?: ConstraintType;
  rmImpact?: number;
  recommendedModule?: ModuleType;
  isRead: boolean;
  createdAt: string;
  priority: "high" | "medium" | "low";
}

export interface LeaderboardEntry {
  rank: number;
  clientId: string;
  clientName: string;
  businessName: string;
  industry: string;
  packageTier: PackageTier;
  baselineRevenue: number;
  currentRevenue: number;
  growthPercentage: number;
  isEligible: boolean;
  hasDoubled: boolean;
  avatar?: string;
  badge?: "gold" | "silver" | "bronze";
}

export interface GanttTask {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "ON_TRACK" | "AT_RISK" | "DELAYED" | "COMPLETED";
  module: ModuleType;
  assignee: string;
  percentComplete: number;
}

export interface FinancialRecord {
  clientId: string;
  clientName: string;
  packageTier: PackageTier;
  mrr: number;
  arr: number;
  ltv: number;
  cac: number;
  paybackMonths: number;
  churnRisk: "LOW" | "MEDIUM" | "HIGH";
  totalPaid: number;
  joinedMonths: number;
}

export interface ConstraintDiagnostic {
  constraintType: ConstraintType;
  problemStatement: string;
  estimatedRMLoss: number;
  evidenceValue: number;
  evidenceUnit: string;
  industryStandard: string;
  suggestedModule: ModuleType;
  suggestedPackage: PackageTier;
  severity: "critical" | "warning" | "moderate";
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  baseline: number;
  leads?: number;
  cpl?: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  baseline: number;
  profit: number;
}
