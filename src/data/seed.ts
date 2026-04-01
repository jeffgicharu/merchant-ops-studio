import type {
  ActivityItem,
  Dispute,
  Merchant,
  OpsSnapshot,
  RiskCase,
  SettlementBatch,
  TrendPoint
} from "../lib/types";

const merchants: Merchant[] = [
  {
    id: "m-101",
    name: "SwiftCart Market",
    segment: "Marketplace",
    region: "East Africa",
    tier: "Strategic",
    status: "Healthy",
    owner: "Amina Wekesa",
    city: "Nairobi",
    monthlyVolume: 18400000,
    disputeRate: 0.36,
    authRate: 94.8,
    settlementHealth: "Stable",
    channels: ["Cards", "M-Pesa", "Bank transfer"],
    integrationStatus: "Live",
    riskScore: 31,
    mcc: "5311 Department Stores",
    notes: [
      "Migrated to split settlement rules in January.",
      "Holiday volume spike is now normalized."
    ]
  },
  {
    id: "m-102",
    name: "Jetset Connect",
    segment: "Travel",
    region: "Pan-Africa",
    tier: "Watch",
    status: "Review",
    owner: "Brian Odhiambo",
    city: "Kampala",
    monthlyVolume: 12600000,
    disputeRate: 1.92,
    authRate: 88.1,
    settlementHealth: "At risk",
    channels: ["Cards", "Wallets"],
    integrationStatus: "Migration",
    riskScore: 82,
    mcc: "4722 Travel Agencies",
    notes: [
      "Chargeback surge tied to unfulfilled refund policy.",
      "Awaiting updated airline voucher evidence pack."
    ]
  },
  {
    id: "m-103",
    name: "ClinicFlow",
    segment: "SaaS",
    region: "Europe",
    tier: "Growth",
    status: "Healthy",
    owner: "Njeri Mwangi",
    city: "Amsterdam",
    monthlyVolume: 7900000,
    disputeRate: 0.18,
    authRate: 97.2,
    settlementHealth: "Stable",
    channels: ["Cards"],
    integrationStatus: "Live",
    riskScore: 21,
    mcc: "5734 Computer Software",
    notes: [
      "Low-touch merchant with strong renewal retention.",
      "Candidate for automated reserve reduction."
    ]
  },
  {
    id: "m-104",
    name: "CargoPilot",
    segment: "Logistics",
    region: "Gulf",
    tier: "Growth",
    status: "Monitoring",
    owner: "Ali Hassan",
    city: "Dubai",
    monthlyVolume: 10900000,
    disputeRate: 0.62,
    authRate: 92.7,
    settlementHealth: "Delayed",
    channels: ["Cards", "Transfers"],
    integrationStatus: "Staged",
    riskScore: 57,
    mcc: "4214 Motor Freight",
    notes: [
      "Settlement delay linked to beneficiary bank mismatch.",
      "Waiting on treasury approval for USD corridor."
    ]
  },
  {
    id: "m-105",
    name: "Luna Retail House",
    segment: "Retail",
    region: "East Africa",
    tier: "Strategic",
    status: "Healthy",
    owner: "Amina Wekesa",
    city: "Mombasa",
    monthlyVolume: 16100000,
    disputeRate: 0.41,
    authRate: 95.4,
    settlementHealth: "Stable",
    channels: ["Cards", "M-Pesa"],
    integrationStatus: "Live",
    riskScore: 34,
    mcc: "5651 Family Clothing",
    notes: [
      "Strong omnichannel volumes after POS rollout.",
      "Merchant requested weekend settlement pilot."
    ]
  },
  {
    id: "m-106",
    name: "PeakPass Mobility",
    segment: "Marketplace",
    region: "Pan-Africa",
    tier: "Watch",
    status: "Monitoring",
    owner: "Brian Odhiambo",
    city: "Accra",
    monthlyVolume: 14300000,
    disputeRate: 1.14,
    authRate: 90.3,
    settlementHealth: "At risk",
    channels: ["Cards", "Wallets", "Transfers"],
    integrationStatus: "Migration",
    riskScore: 74,
    mcc: "4121 Taxicabs",
    notes: [
      "Chargeback pressure remains elevated in weekend rides.",
      "Pending fraud model threshold recalibration."
    ]
  }
];

const disputes: Dispute[] = [
  {
    id: "dp-4102",
    merchantId: "m-102",
    reason: "Service not provided",
    scheme: "Visa",
    amount: 48200,
    customer: "Grace K.",
    openedAt: "2026-03-26T08:15:00Z",
    dueAt: "2026-04-02T16:00:00Z",
    priority: "Critical",
    status: "Needs review",
    evidence: ["Booking confirmation", "Voucher policy", "Refund response SLA"],
    timeline: [
      { id: "t1", label: "Dispute opened", at: "Mar 26, 11:15" },
      { id: "t2", label: "Issuer evidence received", at: "Mar 27, 09:00" }
    ]
  },
  {
    id: "dp-4107",
    merchantId: "m-106",
    reason: "Fraudulent transaction",
    scheme: "Mastercard",
    amount: 17100,
    customer: "Daniel O.",
    openedAt: "2026-03-28T05:05:00Z",
    dueAt: "2026-04-01T12:00:00Z",
    priority: "High",
    status: "Representing",
    evidence: ["Trip logs", "Device fingerprint", "OTP logs"],
    timeline: [
      { id: "t1", label: "Dispute opened", at: "Mar 28, 08:05" },
      { id: "t2", label: "Fraud analyst assigned", at: "Mar 29, 10:20" },
      { id: "t3", label: "Representment submitted", at: "Mar 30, 15:10" }
    ]
  },
  {
    id: "dp-4110",
    merchantId: "m-104",
    reason: "Duplicate processing",
    scheme: "M-Pesa",
    amount: 9800,
    customer: "Rashid A.",
    openedAt: "2026-03-30T06:45:00Z",
    dueAt: "2026-04-03T16:00:00Z",
    priority: "Medium",
    status: "Needs review",
    evidence: ["Settlement log", "Ledger trace", "Retry response"],
    timeline: [{ id: "t1", label: "Dispute opened", at: "Mar 30, 09:45" }]
  },
  {
    id: "dp-4113",
    merchantId: "m-101",
    reason: "Goods not as described",
    scheme: "Visa",
    amount: 12800,
    customer: "Faith N.",
    openedAt: "2026-03-29T13:30:00Z",
    dueAt: "2026-04-05T16:00:00Z",
    priority: "Medium",
    status: "Refunded",
    evidence: ["Delivery manifest", "Order note", "Support transcript"],
    timeline: [
      { id: "t1", label: "Dispute opened", at: "Mar 29, 16:30" },
      { id: "t2", label: "Merchant approved refund", at: "Mar 30, 10:40" }
    ]
  },
  {
    id: "dp-4116",
    merchantId: "m-105",
    reason: "Credit not processed",
    scheme: "Airtel",
    amount: 6400,
    customer: "John P.",
    openedAt: "2026-03-27T11:50:00Z",
    dueAt: "2026-04-01T09:00:00Z",
    priority: "High",
    status: "Needs review",
    evidence: ["Return receipt", "Support refund promise", "Wallet reversal logs"],
    timeline: [
      { id: "t1", label: "Dispute opened", at: "Mar 27, 14:50" },
      { id: "t2", label: "Support escalation linked", at: "Mar 28, 08:15" }
    ]
  }
];

const riskCases: RiskCase[] = [
  {
    id: "rk-501",
    merchantId: "m-102",
    title: "Refund velocity spike",
    signal: "Refund ratio breached 14-day threshold",
    severity: "Critical",
    status: "Assigned",
    owner: "Mercy Tanui",
    createdAt: "2026-03-30T07:15:00Z",
    dueLabel: "Due in 3h",
    expectedLoss: 620000,
    riskScore: 92,
    notes: [
      "Pattern overlaps with unfulfilled travel inventory.",
      "Recommend rolling reserve increase before next payout."
    ]
  },
  {
    id: "rk-502",
    merchantId: "m-106",
    title: "Shared device anomaly",
    signal: "Clustered card attempts across 19 rider devices",
    severity: "High",
    status: "Open",
    owner: null,
    createdAt: "2026-03-31T05:40:00Z",
    dueLabel: "Due in 6h",
    expectedLoss: 240000,
    riskScore: 78,
    notes: [
      "Potential promo abuse ring.",
      "Request device graph expansion before merchant outreach."
    ]
  },
  {
    id: "rk-503",
    merchantId: "m-104",
    title: "Beneficiary mismatch",
    signal: "Settlement beneficiary diverges from onboarding docs",
    severity: "High",
    status: "Monitoring",
    owner: "Ali Hassan",
    createdAt: "2026-03-28T12:30:00Z",
    dueLabel: "Review tomorrow",
    expectedLoss: 180000,
    riskScore: 69,
    notes: [
      "Treasury has paused the USD release batch.",
      "Document refresh requested from merchant."
    ]
  },
  {
    id: "rk-504",
    merchantId: "m-101",
    title: "Promo abuse watch",
    signal: "Coupon redemption exceeds historical baseline",
    severity: "Medium",
    status: "Cleared",
    owner: "Njeri Mwangi",
    createdAt: "2026-03-25T10:20:00Z",
    dueLabel: "Cleared today",
    expectedLoss: 54000,
    riskScore: 48,
    notes: [
      "Ruled out merchant-side compromise.",
      "Campaign controls updated."
    ]
  }
];

const settlements: SettlementBatch[] = [
  {
    id: "st-8801",
    merchantId: "m-101",
    scheduledFor: "2026-03-31",
    amount: 3120000,
    currency: "KES",
    status: "Released",
    channel: "Cards",
    reserveImpact: -120000
  },
  {
    id: "st-8802",
    merchantId: "m-102",
    scheduledFor: "2026-03-31",
    amount: 1980000,
    currency: "KES",
    status: "On hold",
    channel: "Wallets",
    reserveImpact: 410000,
    issue: "Reserve increase pending travel dispute review"
  },
  {
    id: "st-8803",
    merchantId: "m-103",
    scheduledFor: "2026-04-01",
    amount: 960000,
    currency: "USD",
    status: "Scheduled",
    channel: "Cards",
    reserveImpact: -40000
  },
  {
    id: "st-8804",
    merchantId: "m-104",
    scheduledFor: "2026-04-01",
    amount: 1420000,
    currency: "USD",
    status: "On hold",
    channel: "Transfers",
    reserveImpact: 180000,
    issue: "Beneficiary mismatch under review"
  },
  {
    id: "st-8805",
    merchantId: "m-105",
    scheduledFor: "2026-04-01",
    amount: 2740000,
    currency: "KES",
    status: "Scheduled",
    channel: "Cards",
    reserveImpact: -95000
  },
  {
    id: "st-8806",
    merchantId: "m-106",
    scheduledFor: "2026-04-02",
    amount: 2260000,
    currency: "KES",
    status: "Scheduled",
    channel: "Wallets",
    reserveImpact: 150000
  }
];

const activity: ActivityItem[] = [
  {
    id: "act-1",
    actor: "Mercy Tanui",
    action: "Assigned critical risk review",
    subject: "Jetset Connect",
    at: "11 min ago",
    tone: "critical"
  },
  {
    id: "act-2",
    actor: "Treasury automation",
    action: "Released batch",
    subject: "SwiftCart Market payout",
    at: "29 min ago",
    tone: "positive"
  },
  {
    id: "act-3",
    actor: "Support queue",
    action: "Linked refund promise",
    subject: "Luna Retail dispute dp-4116",
    at: "58 min ago",
    tone: "warning"
  },
  {
    id: "act-4",
    actor: "Ops analyst",
    action: "Escalated device cluster",
    subject: "PeakPass Mobility",
    at: "1h ago",
    tone: "warning"
  }
];

const throughputTrend: TrendPoint[] = [
  { label: "Mon", value: 4.2 },
  { label: "Tue", value: 4.7 },
  { label: "Wed", value: 4.5 },
  { label: "Thu", value: 5.1 },
  { label: "Fri", value: 6.4 },
  { label: "Sat", value: 5.8 },
  { label: "Sun", value: 5.3 }
];

const settlementTrend: TrendPoint[] = [
  { label: "Week 1", value: 91 },
  { label: "Week 2", value: 94 },
  { label: "Week 3", value: 89 },
  { label: "Week 4", value: 96 }
];

export const initialSnapshot: OpsSnapshot = {
  merchants,
  disputes,
  riskCases,
  settlements,
  activity,
  throughputTrend,
  settlementTrend
};
