export type MerchantTier = "Strategic" | "Growth" | "Watch";
export type MerchantStatus = "Healthy" | "Monitoring" | "Review";
export type SettlementStatus = "Scheduled" | "On hold" | "Released";
export type DisputeStatus =
  | "Needs review"
  | "Representing"
  | "Refunded"
  | "Accepted liability";
export type Priority = "Critical" | "High" | "Medium";
export type RiskSeverity = "Critical" | "High" | "Medium";
export type RiskStatus = "Open" | "Assigned" | "Monitoring" | "Cleared";
export type Tone = "neutral" | "positive" | "warning" | "critical";

export interface Merchant {
  id: string;
  name: string;
  segment: "Marketplace" | "Retail" | "Travel" | "Logistics" | "SaaS";
  region: "East Africa" | "Pan-Africa" | "Gulf" | "Europe";
  tier: MerchantTier;
  status: MerchantStatus;
  owner: string;
  city: string;
  monthlyVolume: number;
  disputeRate: number;
  authRate: number;
  settlementHealth: "Stable" | "At risk" | "Delayed";
  channels: string[];
  integrationStatus: "Live" | "Staged" | "Migration";
  riskScore: number;
  mcc: string;
  notes: string[];
}

export interface DisputeTimelineEntry {
  id: string;
  label: string;
  at: string;
}

export interface Dispute {
  id: string;
  merchantId: string;
  reason: string;
  scheme: "Visa" | "Mastercard" | "M-Pesa" | "Airtel";
  amount: number;
  customer: string;
  openedAt: string;
  dueAt: string;
  priority: Priority;
  status: DisputeStatus;
  evidence: string[];
  timeline: DisputeTimelineEntry[];
}

export interface RiskCase {
  id: string;
  merchantId: string;
  title: string;
  signal: string;
  severity: RiskSeverity;
  status: RiskStatus;
  owner: string | null;
  createdAt: string;
  dueLabel: string;
  expectedLoss: number;
  riskScore: number;
  notes: string[];
}

export interface SettlementBatch {
  id: string;
  merchantId: string;
  scheduledFor: string;
  amount: number;
  currency: "KES" | "USD";
  status: SettlementStatus;
  channel: "Cards" | "Wallets" | "Transfers";
  reserveImpact: number;
  issue?: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  subject: string;
  at: string;
  tone: Tone;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: Tone;
}

export interface OpsSnapshot {
  merchants: Merchant[];
  disputes: Dispute[];
  riskCases: RiskCase[];
  settlements: SettlementBatch[];
  activity: ActivityItem[];
  throughputTrend: TrendPoint[];
  settlementTrend: TrendPoint[];
}

export interface ActionResponse {
  summary: string;
}
