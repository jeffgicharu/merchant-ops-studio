import { formatCompactMoney, formatCompactNumber, formatPercent } from "./formatters";
import type { MetricCard, OpsSnapshot, Tone } from "./types";

export function getMerchantName(snapshot: OpsSnapshot, merchantId: string) {
  return snapshot.merchants.find((merchant) => merchant.id === merchantId)?.name ?? "Unknown merchant";
}

export function getOverviewMetricCards(snapshot: OpsSnapshot): MetricCard[] {
  const processed = snapshot.merchants.reduce((total, merchant) => total + merchant.monthlyVolume, 0);
  const openDisputes = snapshot.disputes.filter(
    (dispute) => dispute.status === "Needs review" || dispute.status === "Representing"
  );
  const onHoldSettlements = snapshot.settlements.filter((settlement) => settlement.status === "On hold");
  const exposure = openDisputes.reduce((total, dispute) => total + dispute.amount, 0);
  const sameDayRate =
    (snapshot.settlements.filter((settlement) => settlement.status === "Released").length /
      snapshot.settlements.length) *
    100;

  return [
    {
      id: "processed",
      label: "Monthly merchant volume",
      value: formatCompactMoney(processed),
      detail: "Across six active merchant accounts",
      trend: "+12.8% week-on-week",
      tone: "positive"
    },
    {
      id: "disputes",
      label: "Dispute exposure",
      value: formatCompactMoney(exposure),
      detail: `${openDisputes.length} active queues in motion`,
      trend: "-8 cases from last Friday",
      tone: openDisputes.length > 3 ? "warning" : "neutral"
    },
    {
      id: "settlements",
      label: "Same-day settlement rate",
      value: formatPercent(sameDayRate),
      detail: `${onHoldSettlements.length} payout batches on hold`,
      trend: "+4.2 pts this cycle",
      tone: onHoldSettlements.length > 1 ? "warning" : "positive"
    },
    {
      id: "merchants",
      label: "Merchants under watch",
      value: formatCompactNumber(
        snapshot.merchants.filter((merchant) => merchant.status !== "Healthy").length
      ),
      detail: "Monitoring and review cohorts",
      trend: "2 require same-day outreach",
      tone: "critical"
    }
  ];
}

export function getStatusTone(value: string): Tone {
  if (["Critical", "Review", "On hold", "Needs review", "Delayed"].includes(value)) {
    return "critical";
  }

  if (["High", "Monitoring", "Representing", "At risk"].includes(value)) {
    return "warning";
  }

  if (["Healthy", "Released", "Cleared", "Stable", "Live", "Refunded"].includes(value)) {
    return "positive";
  }

  return "neutral";
}

export function getNavCounts(snapshot: OpsSnapshot) {
  return {
    disputes: snapshot.disputes.filter((dispute) => dispute.status === "Needs review").length,
    risk: snapshot.riskCases.filter((riskCase) => riskCase.status !== "Cleared").length,
    settlements: snapshot.settlements.filter((settlement) => settlement.status === "On hold").length
  };
}
