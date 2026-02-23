import type {
  Client,
  Lead,
  Campaign,
  LeaderboardEntry,
  GanttTask,
  FinancialRecord,
  Notification,
  IndustryBenchmark,
  BaselineSnapshot,
  RevenueData,
  ConstraintDiagnostic,
  KPIMetric,
  PipelineStage,
} from "@/types";

// ============================================================
// MOCK CLIENTS
// ============================================================
export const mockClients: Client[] = [
  {
    id: "c1",
    name: "Faizal Azman",
    businessName: "Solar Pro Malaysia",
    email: "faizal@solarpro.my",
    phone: "+60 12-345 6789",
    industry: "Solar Energy",
    packageTier: "BEGINNER",
    role: "PAID_CLIENT",
    healthScore: 42,
    healthStatus: "CRITICAL",
    activeModules: ["ADS_PERFORMANCE"],
    baselineCaptured: true,
    baselineDate: "2025-11-01",
    contractSigned: true,
    paymentConfirmed: true,
    joinedAt: "2025-11-01",
  },
  {
    id: "c2",
    name: "Nurul Hana",
    businessName: "Bunga House KL",
    email: "hana@bungahouse.my",
    phone: "+60 11-234 5678",
    industry: "Florist",
    packageTier: "INTERMEDIATE",
    role: "PAID_CLIENT",
    healthScore: 68,
    healthStatus: "WARNING",
    activeModules: ["ADS_PERFORMANCE", "SALES_OPTIMIZATION"],
    baselineCaptured: true,
    baselineDate: "2025-10-15",
    contractSigned: true,
    paymentConfirmed: true,
    joinedAt: "2025-10-15",
  },
  {
    id: "c3",
    name: "Marcus Tan",
    businessName: "TechMart Online",
    email: "marcus@techmart.my",
    phone: "+60 16-987 6543",
    industry: "E-commerce",
    packageTier: "ADVANCED",
    role: "PAID_CLIENT",
    healthScore: 91,
    healthStatus: "EXCELLENT",
    activeModules: ["ADS_PERFORMANCE", "SALES_OPTIMIZATION", "INFLUENCER_MARKETING", "CONTENT_CREATION"],
    baselineCaptured: true,
    baselineDate: "2025-09-01",
    contractSigned: true,
    paymentConfirmed: true,
    joinedAt: "2025-09-01",
  },
  {
    id: "c4",
    name: "Siti Aisyah",
    businessName: "GreenEats Cafe",
    email: "siti@greeneats.my",
    phone: "+60 13-456 7890",
    industry: "F&B",
    packageTier: "BEGINNER",
    role: "PAID_CLIENT",
    healthScore: 55,
    healthStatus: "WARNING",
    activeModules: ["ADS_PERFORMANCE"],
    baselineCaptured: true,
    baselineDate: "2025-12-01",
    contractSigned: true,
    paymentConfirmed: true,
    joinedAt: "2025-12-01",
  },
  {
    id: "c5",
    name: "Rizwan Malik",
    businessName: "FitLife Studio",
    email: "rizwan@fitlife.my",
    phone: "+60 17-654 3210",
    industry: "Fitness",
    packageTier: "INTERMEDIATE",
    role: "PAID_CLIENT",
    healthScore: 79,
    healthStatus: "GOOD",
    activeModules: ["ADS_PERFORMANCE", "SALES_OPTIMIZATION", "AI_CHATBOT"],
    baselineCaptured: true,
    baselineDate: "2025-10-01",
    contractSigned: true,
    paymentConfirmed: true,
    joinedAt: "2025-10-01",
  },
  {
    id: "c6",
    name: "Amirul Hakim",
    businessName: "PropNest Realty",
    email: "amirul@propnest.my",
    phone: "+60 14-789 0123",
    industry: "Real Estate",
    packageTier: "NONE",
    role: "FREE_CLIENT",
    healthScore: 30,
    healthStatus: "CRITICAL",
    activeModules: [],
    baselineCaptured: false,
    contractSigned: false,
    paymentConfirmed: false,
    joinedAt: "2026-01-15",
  },
];

// ============================================================
// ACTIVE CLIENT BASELINE (Solar Pro - c1)
// ============================================================
export const activeClientBaseline: BaselineSnapshot = {
  id: "b1",
  tenantId: "c1",
  capturedAt: "2025-11-01T09:00:00Z",
  avgRevenueRM: 45000,
  avgProfitRM: 13500,
  avgCAC: 580,
  avgLTV: 3800,
  avgConversionRate: 14,
  avgCPL: 22,
  avgChurn: 8,
  avgLeads: 40,
  avgROAS: 3.2,
  isImmutable: true,
};

// ============================================================
// CURRENT KPIs (Solar Pro - Active Client View)
// ============================================================
export const currentKPIs: KPIMetric[] = [
  {
    label: "Monthly Revenue",
    value: 51000,
    unit: "RM",
    baseline: 45000,
    delta: 13.3,
    trend: "up",
    status: "good",
    sparklineData: [40000, 42000, 41500, 44000, 47000, 49000, 51000],
  },
  {
    label: "Leads / Month",
    value: 45,
    unit: "leads",
    baseline: 40,
    delta: 12.5,
    trend: "up",
    status: "good",
    industryMin: 60,
    industryMax: 120,
    sparklineData: [38, 39, 42, 40, 44, 43, 45],
  },
  {
    label: "Cost Per Lead",
    value: 34,
    unit: "RM",
    baseline: 22,
    delta: -54.5,
    trend: "up",
    status: "critical",
    industryMin: 10,
    industryMax: 20,
    sparklineData: [22, 24, 27, 29, 31, 33, 34],
  },
  {
    label: "Close Rate",
    value: 12,
    unit: "%",
    baseline: 14,
    delta: -14.3,
    trend: "down",
    status: "critical",
    industryMin: 20,
    industryMax: 35,
    sparklineData: [14, 14, 13, 13, 12, 12, 12],
  },
  {
    label: "Customer CAC",
    value: 680,
    unit: "RM",
    baseline: 580,
    delta: -17.2,
    trend: "up",
    status: "warning",
    industryMin: 200,
    industryMax: 400,
    sparklineData: [580, 590, 610, 630, 650, 665, 680],
  },
  {
    label: "Lifetime Value",
    value: 4200,
    unit: "RM",
    baseline: 3800,
    delta: 10.5,
    trend: "up",
    status: "good",
    sparklineData: [3800, 3850, 3900, 3950, 4050, 4150, 4200],
  },
];

// ============================================================
// REVENUE CHART DATA
// ============================================================
export const revenueChartData: RevenueData[] = [
  { month: "Aug", revenue: 38000, baseline: 45000, profit: 10000 },
  { month: "Sep", revenue: 41000, baseline: 45000, profit: 11000 },
  { month: "Oct", revenue: 43500, baseline: 45000, profit: 12000 },
  { month: "Nov", revenue: 45000, baseline: 45000, profit: 13500 },
  { month: "Dec", revenue: 47500, baseline: 45000, profit: 14000 },
  { month: "Jan", revenue: 49000, baseline: 45000, profit: 14500 },
  { month: "Feb", revenue: 51000, baseline: 45000, profit: 15200 },
];

// ============================================================
// INDUSTRY BENCHMARKS
// ============================================================
export const industryBenchmarks: IndustryBenchmark[] = [
  {
    industry: "Solar Energy",
    geography: "Malaysia",
    cplMin: 10,
    cplMax: 20,
    cacMin: 200,
    cacMax: 400,
    closeRateMin: 20,
    closeRateMax: 35,
    roasMin: 3,
    roasMax: 5,
    ltvMin: 4500,
    ltvMax: 8000,
    churnMax: 5,
  },
  {
    industry: "Florist",
    geography: "Malaysia",
    cplMin: 7,
    cplMax: 15,
    cacMin: 80,
    cacMax: 180,
    closeRateMin: 25,
    closeRateMax: 45,
    roasMin: 4,
    roasMax: 8,
    ltvMin: 800,
    ltvMax: 1800,
    churnMax: 12,
  },
  {
    industry: "E-commerce",
    geography: "Malaysia",
    cplMin: 3,
    cplMax: 12,
    cacMin: 30,
    cacMax: 100,
    closeRateMin: 2,
    closeRateMax: 5,
    roasMin: 3,
    roasMax: 6,
    ltvMin: 300,
    ltvMax: 800,
    churnMax: 25,
  },
];

// ============================================================
// CONSTRAINT DIAGNOSTIC (Solar Pro)
// ============================================================
export const primaryConstraint: ConstraintDiagnostic = {
  constraintType: "CPL_TOO_HIGH",
  problemStatement:
    "Your Cost Per Lead (RM 34) is 2.4x above the market standard for Solar Energy in Malaysia (RM 10–20). This is inflating your CAC to RM 680 and costing you an estimated RM 18,000/month in wasted ad spend.",
  estimatedRMLoss: 18000,
  evidenceValue: 34,
  evidenceUnit: "RM/lead",
  industryStandard: "RM 10–20/lead",
  suggestedModule: "ADS_PERFORMANCE",
  suggestedPackage: "BEGINNER",
  severity: "critical",
};

// ============================================================
// PIPELINE LEADS
// ============================================================
export const mockLeads: Lead[] = [
  { id: "l1", name: "Ahmad Zulkifli", company: "Solarhome Sdn Bhd", email: "ahmad@solarhome.my", phone: "+60 12-111 2222", stage: "NEW_LEAD", dealValue: 18000, source: "Facebook Ads", industry: "Solar Energy", daysInStage: 2, assignedAgent: "Hakim", lastContact: "2026-02-21", createdAt: "2026-02-20", },
  { id: "l2", name: "Rohani Binti Said", company: "Green Realty", email: "rohani@greenrealty.my", phone: "+60 11-222 3333", stage: "NEW_LEAD", dealValue: 24000, source: "Meta Lead Form", industry: "Real Estate", daysInStage: 5, assignedAgent: "Syafiq", lastContact: "2026-02-18", createdAt: "2026-02-16", },
  { id: "l3", name: "Kevin Lim", company: "Lim Brothers Trading", email: "kevin@limbrothers.my", phone: "+60 16-333 4444", stage: "CONTACTED", dealValue: 15000, source: "Google Ads", industry: "Solar Energy", daysInStage: 8, assignedAgent: "Hakim", lastContact: "2026-02-19", createdAt: "2026-02-12", },
  { id: "l4", name: "Norzahra Ismail", company: "SunPower Homes", email: "norzahra@sunpower.my", phone: "+60 13-444 5555", stage: "CONTACTED", dealValue: 22000, source: "Referral", industry: "Solar Energy", daysInStage: 16, assignedAgent: "Syafiq", lastContact: "2026-02-15", createdAt: "2026-02-06", },
  { id: "l5", name: "Danial Arif", company: "EcoVolt Solutions", email: "danial@ecovolt.my", phone: "+60 17-555 6666", stage: "QUALIFIED", dealValue: 31000, source: "Facebook Ads", industry: "Solar Energy", daysInStage: 11, assignedAgent: "Hakim", lastContact: "2026-02-20", createdAt: "2026-02-10", },
  { id: "l6", name: "Melissa Wong", company: "WM Properties", email: "melissa@wmprop.my", phone: "+60 12-666 7777", stage: "QUALIFIED", dealValue: 19500, source: "TikTok Ads", industry: "Real Estate", daysInStage: 7, assignedAgent: "Rina", lastContact: "2026-02-19", createdAt: "2026-02-13", },
  { id: "l7", name: "Hafiz Rahman", company: "Rahman Holdings", email: "hafiz@rahmanhold.my", phone: "+60 11-777 8888", stage: "PROPOSAL", dealValue: 45000, source: "Meta Lead Form", industry: "Solar Energy", daysInStage: 19, assignedAgent: "Syafiq", lastContact: "2026-02-18", createdAt: "2026-02-02", },
  { id: "l8", name: "Liyana Putri", company: "Putri Solar Co", email: "liyana@putrisolar.my", phone: "+60 16-888 9999", stage: "PROPOSAL", dealValue: 28000, source: "Google Ads", industry: "Solar Energy", daysInStage: 34, assignedAgent: "Hakim", lastContact: "2026-02-14", createdAt: "2026-01-18", },
  { id: "l9", name: "Izzat Kamarudin", company: "Kamar Solar", email: "izzat@kamarsolar.my", phone: "+60 13-999 0000", stage: "NEGOTIATION", dealValue: 38000, source: "Referral", industry: "Solar Energy", daysInStage: 5, assignedAgent: "Rina", lastContact: "2026-02-20", createdAt: "2026-01-25", },
  { id: "l10", name: "Shuhaida Mohd", company: "SH Energy", email: "shuhaida@shenergy.my", phone: "+60 17-000 1111", stage: "WON", dealValue: 32000, source: "Facebook Ads", industry: "Solar Energy", daysInStage: 0, assignedAgent: "Syafiq", lastContact: "2026-02-17", createdAt: "2026-01-10", },
  { id: "l11", name: "Bernard Choo", company: "Choo Ventures", email: "bernard@chooventures.my", phone: "+60 12-111 3333", stage: "WON", dealValue: 26000, source: "Meta Lead Form", industry: "Solar Energy", daysInStage: 0, assignedAgent: "Hakim", lastContact: "2026-02-10", createdAt: "2026-01-05", },
  { id: "l12", name: "Farida Yusof", company: "EcoHome Solutions", email: "farida@ecohome.my", phone: "+60 11-444 5555", stage: "LOST", dealValue: 21000, source: "Google Ads", industry: "Solar Energy", daysInStage: 0, assignedAgent: "Rina", lastContact: "2026-02-12", createdAt: "2026-01-20", },
];

// ============================================================
// PIPELINE STAGES SUMMARY
// ============================================================
export const getPipelineStages = (): PipelineStage[] => {
  const stageConfig = [
    { stage: "NEW_LEAD" as const, label: "New Lead", color: "#6B7280" },
    { stage: "CONTACTED" as const, label: "Contacted", color: "#3B82F6" },
    { stage: "QUALIFIED" as const, label: "Qualified", color: "#06B6D4" },
    { stage: "PROPOSAL" as const, label: "Proposal", color: "#8B5CF6" },
    { stage: "NEGOTIATION" as const, label: "Negotiation", color: "#F59E0B" },
    { stage: "WON" as const, label: "Won", color: "#10B981" },
  ];

  return stageConfig.map(({ stage, label, color }) => {
    const leads = mockLeads.filter((l) => l.stage === stage);
    return {
      stage,
      label,
      color,
      count: leads.length,
      totalValue: leads.reduce((sum, l) => sum + l.dealValue, 0),
      leads,
    };
  });
};

// ============================================================
// CAMPAIGNS (Ads Module)
// ============================================================
export const mockCampaigns: Campaign[] = [
  {
    id: "cam1",
    name: "Solar - Klang Valley Q1",
    platform: "Facebook",
    status: "ACTIVE",
    budget: 5000,
    spent: 3420,
    leads: 28,
    cpl: 122,
    roas: 1.8,
    impressions: 142000,
    clicks: 2840,
    ctr: 2.0,
    startDate: "2026-02-01",
  },
  {
    id: "cam2",
    name: "Solar - Retargeting Warm",
    platform: "Facebook",
    status: "ACTIVE",
    budget: 2000,
    spent: 1180,
    leads: 12,
    cpl: 98,
    roas: 2.4,
    impressions: 58000,
    clicks: 980,
    ctr: 1.69,
    startDate: "2026-02-05",
  },
  {
    id: "cam3",
    name: "Solar - Google Search",
    platform: "Google",
    status: "ACTIVE",
    budget: 3000,
    spent: 2100,
    leads: 8,
    cpl: 262,
    roas: 1.2,
    impressions: 31000,
    clicks: 620,
    ctr: 2.0,
    startDate: "2026-02-01",
  },
  {
    id: "cam4",
    name: "Solar - TikTok Awareness",
    platform: "TikTok",
    status: "PAUSED",
    budget: 1500,
    spent: 1500,
    leads: 5,
    cpl: 300,
    roas: 0.9,
    impressions: 89000,
    clicks: 445,
    ctr: 0.5,
    startDate: "2026-01-15",
    endDate: "2026-01-31",
  },
  {
    id: "cam5",
    name: "Solar - Referral Program",
    platform: "WhatsApp",
    status: "ACTIVE",
    budget: 800,
    spent: 120,
    leads: 4,
    cpl: 30,
    roas: 4.2,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    startDate: "2026-02-10",
  },
];

// ============================================================
// LEADERBOARD
// ============================================================
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    clientId: "c3",
    clientName: "Marcus Tan",
    businessName: "TechMart Online",
    industry: "E-commerce",
    packageTier: "ADVANCED",
    baselineRevenue: 62000,
    currentRevenue: 131000,
    growthPercentage: 111.3,
    isEligible: true,
    hasDoubled: true,
    badge: "gold",
  },
  {
    rank: 2,
    clientId: "c5",
    clientName: "Rizwan Malik",
    businessName: "FitLife Studio",
    industry: "Fitness",
    packageTier: "INTERMEDIATE",
    baselineRevenue: 18000,
    currentRevenue: 31500,
    growthPercentage: 75.0,
    isEligible: true,
    hasDoubled: false,
    badge: "silver",
  },
  {
    rank: 3,
    clientId: "c2",
    clientName: "Nurul Hana",
    businessName: "Bunga House KL",
    industry: "Florist",
    packageTier: "INTERMEDIATE",
    baselineRevenue: 22000,
    currentRevenue: 35200,
    growthPercentage: 60.0,
    isEligible: true,
    hasDoubled: false,
    badge: "bronze",
  },
  {
    rank: 4,
    clientId: "c1",
    clientName: "Faizal Azman",
    businessName: "Solar Pro Malaysia",
    industry: "Solar Energy",
    packageTier: "BEGINNER",
    baselineRevenue: 45000,
    currentRevenue: 51000,
    growthPercentage: 13.3,
    isEligible: false,
    hasDoubled: false,
  },
  {
    rank: 5,
    clientId: "c4",
    clientName: "Siti Aisyah",
    businessName: "GreenEats Cafe",
    industry: "F&B",
    packageTier: "BEGINNER",
    baselineRevenue: 28000,
    currentRevenue: 31360,
    growthPercentage: 12.0,
    isEligible: false,
    hasDoubled: false,
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "SYSTEM_ALERT",
    title: "⚠️ Critical: CPL 2.4x Above Industry Standard",
    message:
      "Your Cost Per Lead (RM 34) is significantly above the Solar Energy Malaysia benchmark of RM 10–20. This is your #1 revenue constraint, costing an estimated RM 18,000/month in wasted ad spend. Fix this first before internal optimisation.",
    constraintType: "CPL_TOO_HIGH",
    rmImpact: 18000,
    recommendedModule: "ADS_PERFORMANCE",
    isRead: false,
    createdAt: "2026-02-21T08:00:00Z",
    priority: "high",
  },
  {
    id: "n2",
    type: "TRANSACTIONAL",
    title: "✅ Payment Received — Beginner Package",
    message:
      "Payment of RM 1,500 received for the Beginner Package. Your Ads Performance module has been unlocked. Baseline snapshot has been captured.",
    isRead: true,
    createdAt: "2025-11-01T10:30:00Z",
    priority: "medium",
  },
  {
    id: "n3",
    type: "TRANSACTIONAL",
    title: "📄 Contract Signed — Beginner Package",
    message: "Your service contract for the Beginner Package has been signed and recorded. Welcome to Agenz OS.",
    isRead: true,
    createdAt: "2025-11-01T09:15:00Z",
    priority: "medium",
  },
  {
    id: "n4",
    type: "PROMOTIONAL",
    title: "🚀 Scale Your Business — Advanced Package Now Available",
    message:
      "Unlock Influencer Marketing, Content Creation, and AI Video modules. Businesses on Advanced grew revenue by an average of 67% in 90 days.",
    isRead: false,
    createdAt: "2026-02-15T12:00:00Z",
    priority: "low",
  },
];

// ============================================================
// GANTT DATA
// ============================================================
export const mockGanttTasks: GanttTask[] = [
  {
    id: "g1",
    clientId: "c1",
    clientName: "Solar Pro Malaysia",
    title: "Campaign Setup & Audit",
    startDate: "2025-11-01",
    endDate: "2025-11-15",
    status: "COMPLETED",
    module: "ADS_PERFORMANCE",
    assignee: "Hakim",
    percentComplete: 100,
  },
  {
    id: "g2",
    clientId: "c1",
    clientName: "Solar Pro Malaysia",
    title: "CPL Optimisation Sprint",
    startDate: "2025-11-15",
    endDate: "2026-01-15",
    status: "AT_RISK",
    module: "ADS_PERFORMANCE",
    assignee: "Hakim",
    percentComplete: 65,
  },
  {
    id: "g3",
    clientId: "c1",
    clientName: "Solar Pro Malaysia",
    title: "90-Day Revenue Review",
    startDate: "2026-02-01",
    endDate: "2026-03-01",
    status: "ON_TRACK",
    module: "ADS_PERFORMANCE",
    assignee: "Syafiq",
    percentComplete: 30,
  },
  {
    id: "g4",
    clientId: "c2",
    clientName: "Bunga House KL",
    title: "Sales Funnel Audit",
    startDate: "2025-10-15",
    endDate: "2025-10-30",
    status: "COMPLETED",
    module: "SALES_OPTIMIZATION",
    assignee: "Rina",
    percentComplete: 100,
  },
  {
    id: "g5",
    clientId: "c2",
    clientName: "Bunga House KL",
    title: "Close Rate Improvement",
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    status: "ON_TRACK",
    module: "SALES_OPTIMIZATION",
    assignee: "Rina",
    percentComplete: 80,
  },
  {
    id: "g6",
    clientId: "c3",
    clientName: "TechMart Online",
    title: "Influencer Campaign Launch",
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    status: "ON_TRACK",
    module: "INFLUENCER_MARKETING",
    assignee: "Hakim",
    percentComplete: 75,
  },
  {
    id: "g7",
    clientId: "c4",
    clientName: "GreenEats Cafe",
    title: "Ad Creative Refresh",
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    status: "DELAYED",
    module: "ADS_PERFORMANCE",
    assignee: "Syafiq",
    percentComplete: 20,
  },
  {
    id: "g8",
    clientId: "c5",
    clientName: "FitLife Studio",
    title: "AI Chatbot Integration",
    startDate: "2026-01-01",
    endDate: "2026-02-15",
    status: "COMPLETED",
    module: "AI_CHATBOT",
    assignee: "Rina",
    percentComplete: 100,
  },
];

// ============================================================
// FINANCIAL DATA
// ============================================================
export const mockFinancials: FinancialRecord[] = [
  {
    clientId: "c3",
    clientName: "TechMart Online",
    packageTier: "ADVANCED",
    mrr: 5500,
    arr: 66000,
    ltv: 33000,
    cac: 2200,
    paybackMonths: 0.4,
    churnRisk: "LOW",
    totalPaid: 30800,
    joinedMonths: 6,
  },
  {
    clientId: "c5",
    clientName: "FitLife Studio",
    packageTier: "INTERMEDIATE",
    mrr: 3000,
    arr: 36000,
    ltv: 21600,
    cac: 1200,
    paybackMonths: 0.4,
    churnRisk: "LOW",
    totalPaid: 15000,
    joinedMonths: 5,
  },
  {
    clientId: "c2",
    clientName: "Bunga House KL",
    packageTier: "INTERMEDIATE",
    mrr: 3000,
    arr: 36000,
    ltv: 18000,
    cac: 1500,
    paybackMonths: 0.5,
    churnRisk: "MEDIUM",
    totalPaid: 12000,
    joinedMonths: 4,
  },
  {
    clientId: "c1",
    clientName: "Solar Pro Malaysia",
    packageTier: "BEGINNER",
    mrr: 1500,
    arr: 18000,
    ltv: 5400,
    cac: 600,
    paybackMonths: 0.4,
    churnRisk: "HIGH",
    totalPaid: 4500,
    joinedMonths: 3,
  },
  {
    clientId: "c4",
    clientName: "GreenEats Cafe",
    packageTier: "BEGINNER",
    mrr: 1500,
    arr: 18000,
    ltv: 3600,
    cac: 600,
    paybackMonths: 0.4,
    churnRisk: "HIGH",
    totalPaid: 3000,
    joinedMonths: 2,
  },
];

// ============================================================
// CHART: Lead Volume (30 days for Ads module)
// ============================================================
export const leadVolumeData = Array.from({ length: 30 }, (_, i) => ({
  day: `Feb ${i + 1}`,
  leads: Math.floor(Math.random() * 4) + 1,
  target: 2,
}));

// ============================================================
// CHART: Stage Heatmap Data (Sales module)
// ============================================================
export const stageDuration = [
  { stage: "New → Contacted", avg: 1.2, benchmark: 1 },
  { stage: "Contacted → Qualified", avg: 5.8, benchmark: 3 },
  { stage: "Qualified → Proposal", avg: 8.4, benchmark: 5 },
  { stage: "Proposal → Negotiation", avg: 14.2, benchmark: 7 },
  { stage: "Negotiation → Won", avg: 6.1, benchmark: 4 },
];

export const agentPerformance = [
  { name: "Hakim", leads: 18, won: 4, closeRate: 22, avgDeal: 28500 },
  { name: "Syafiq", leads: 15, won: 3, closeRate: 20, avgDeal: 31200 },
  { name: "Rina", leads: 12, won: 2, closeRate: 17, avgDeal: 25800 },
];
