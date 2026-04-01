import { initialSnapshot } from "../data/seed";
import type {
  ActionResponse,
  DisputeStatus,
  OpsSnapshot,
  RiskStatus,
  SettlementStatus
} from "./types";

const STORAGE_KEY = "merchant-ops-studio.snapshot";

function cloneSnapshot(snapshot: OpsSnapshot) {
  return structuredClone(snapshot);
}

function readSnapshot() {
  if (typeof window === "undefined") {
    return cloneSnapshot(initialSnapshot);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return cloneSnapshot(initialSnapshot);
  }

  try {
    return JSON.parse(raw) as OpsSnapshot;
  } catch {
    return cloneSnapshot(initialSnapshot);
  }
}

function persist(snapshot: OpsSnapshot) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function withLatency<T>(value: T) {
  await delay(260);
  return value;
}

export async function loadSnapshot() {
  return withLatency(readSnapshot());
}

export async function resetSnapshot() {
  persist(cloneSnapshot(initialSnapshot));
  return withLatency<ActionResponse>({
    summary: "Workspace reset to the seeded operating baseline."
  });
}

export async function updateDisputeStatus(id: string, status: DisputeStatus) {
  const snapshot = readSnapshot();
  const dispute = snapshot.disputes.find((item) => item.id === id);

  if (!dispute) {
    throw new Error("Dispute not found");
  }

  dispute.status = status;
  dispute.timeline.unshift({
    id: `${id}-${status}`,
    label: `Status changed to ${status}`,
    at: "Just now"
  });
  snapshot.activity.unshift({
    id: `activity-${Date.now()}`,
    actor: "You",
    action: "Updated dispute workflow",
    subject: `${dispute.id} is now ${status}`,
    at: "Just now",
    tone:
      status === "Representing"
        ? "warning"
        : status === "Refunded"
          ? "positive"
          : "neutral"
  });
  persist(snapshot);

  return withLatency<ActionResponse>({
    summary: `Dispute ${id} moved to ${status}.`
  });
}

export async function updateRiskCase(id: string, status: RiskStatus, owner?: string | null) {
  const snapshot = readSnapshot();
  const riskCase = snapshot.riskCases.find((item) => item.id === id);

  if (!riskCase) {
    throw new Error("Risk case not found");
  }

  riskCase.status = status;
  if (owner !== undefined) {
    riskCase.owner = owner;
  }
  snapshot.activity.unshift({
    id: `activity-${Date.now()}`,
    actor: "You",
    action: "Updated risk coverage",
    subject: `${riskCase.title} is ${status.toLowerCase()}`,
    at: "Just now",
    tone: status === "Cleared" ? "positive" : "warning"
  });
  persist(snapshot);

  return withLatency<ActionResponse>({
    summary: `Risk case ${id} updated.`
  });
}

export async function updateSettlementStatus(id: string, status: SettlementStatus) {
  const snapshot = readSnapshot();
  const batch = snapshot.settlements.find((item) => item.id === id);

  if (!batch) {
    throw new Error("Settlement batch not found");
  }

  batch.status = status;
  if (status === "On hold") {
    batch.issue = batch.issue ?? "Manual review initiated from settlement control surface";
  } else {
    batch.issue = undefined;
  }
  snapshot.activity.unshift({
    id: `activity-${Date.now()}`,
    actor: "You",
    action: status === "On hold" ? "Held settlement batch" : "Released settlement batch",
    subject: batch.id,
    at: "Just now",
    tone: status === "Released" ? "positive" : "warning"
  });
  persist(snapshot);

  return withLatency<ActionResponse>({
    summary: `Settlement ${batch.id} is now ${status}.`
  });
}
