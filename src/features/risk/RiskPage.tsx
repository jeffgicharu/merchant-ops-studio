import { useEffect, useMemo, useState } from "react";

import { useOpsData } from "../../app/OpsDataContext";
import { DistributionBars } from "../../components/charts/DistributionBars";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { formatCompactMoney } from "../../lib/formatters";
import { getMerchantName, getStatusTone } from "../../lib/selectors";

const owners = ["Mercy Tanui", "Ali Hassan", "Njeri Mwangi", "Brian Odhiambo"];

export function RiskPage() {
  const { snapshot, setRiskStatus } = useOpsData();
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  const activeRiskCases = useMemo(
    () => snapshot?.riskCases.filter((riskCase) => riskCase.status !== "Cleared") ?? [],
    [snapshot]
  );

  useEffect(() => {
    if (!activeRiskCases.length) {
      setSelectedRiskId(null);
      return;
    }

    if (!selectedRiskId || !activeRiskCases.some((item) => item.id === selectedRiskId)) {
      setSelectedRiskId(activeRiskCases[0].id);
    }
  }, [activeRiskCases, selectedRiskId]);

  if (!snapshot) {
    return <div className="screen-state">Loading workspace...</div>;
  }

  const selectedRisk = activeRiskCases.find((riskCase) => riskCase.id === selectedRiskId) ?? activeRiskCases[0];
  const severityDistribution = [
    {
      id: "critical",
      label: "Critical",
      value: snapshot.riskCases.filter((riskCase) => riskCase.severity === "Critical").length,
      tone: "critical" as const
    },
    {
      id: "high",
      label: "High",
      value: snapshot.riskCases.filter((riskCase) => riskCase.severity === "High").length,
      tone: "warning" as const
    },
    {
      id: "medium",
      label: "Medium",
      value: snapshot.riskCases.filter((riskCase) => riskCase.severity === "Medium").length,
      tone: "neutral" as const
    }
  ];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Risk operations"
        title="Fraud and compliance review board"
        description="A mid-office view for triage, analyst assignment, and expected-loss prioritization. The layout emphasizes fast comprehension over decorative dashboarding."
      />

      <section className="dashboard-grid dashboard-grid--split">
        <Panel title="Signal distribution" subtitle="Risk load by severity" accent="teal">
          <DistributionBars items={severityDistribution} />
          <div className="stat-ribbon">
            <article>
              <span>Expected loss in queue</span>
              <strong>
                {formatCompactMoney(
                  activeRiskCases.reduce((total, riskCase) => total + riskCase.expectedLoss, 0)
                )}
              </strong>
            </article>
            <article>
              <span>Active watch merchants</span>
              <strong>{new Set(activeRiskCases.map((riskCase) => riskCase.merchantId)).size}</strong>
            </article>
          </div>
        </Panel>

        <Panel title="Risk queue" subtitle="Prioritize assignment before treasury or support blocks" accent="ink">
          <div className="card-grid">
            {activeRiskCases.map((riskCase) => (
              <button
                key={riskCase.id}
                className={`signal-card ${selectedRisk?.id === riskCase.id ? "signal-card--active" : ""}`}
                onClick={() => setSelectedRiskId(riskCase.id)}
              >
                <div className="signal-card__header">
                  <Badge tone={getStatusTone(riskCase.severity)}>{riskCase.severity}</Badge>
                  <span>{riskCase.dueLabel}</span>
                </div>
                <h4>{riskCase.title}</h4>
                <p>{getMerchantName(snapshot, riskCase.merchantId)}</p>
                <strong>{formatCompactMoney(riskCase.expectedLoss)}</strong>
              </button>
            ))}
          </div>
        </Panel>
      </section>

      <section className="dashboard-grid dashboard-grid--split">
        <Panel
          title={selectedRisk ? selectedRisk.title : "Risk case detail"}
          subtitle={selectedRisk ? getMerchantName(snapshot, selectedRisk.merchantId) : "Select a case"}
        >
          {selectedRisk ? (
            <div className="detail-rail">
              <div className="detail-rail__hero">
                <Badge tone={getStatusTone(selectedRisk.severity)}>{selectedRisk.severity}</Badge>
                <Badge tone={getStatusTone(selectedRisk.status)}>{selectedRisk.status}</Badge>
              </div>
              <p>{selectedRisk.signal}</p>
              <div className="summary-list">
                <div className="summary-list__row">
                  <span>Owner</span>
                  <strong>{selectedRisk.owner ?? "Unassigned"}</strong>
                </div>
                <div className="summary-list__row">
                  <span>Risk score</span>
                  <strong>{selectedRisk.riskScore}</strong>
                </div>
                <div className="summary-list__row">
                  <span>Created</span>
                  <strong>{selectedRisk.createdAt.slice(0, 10)}</strong>
                </div>
              </div>

              <div>
                <p className="eyebrow">Analyst notes</p>
                <div className="feature-points">
                  {selectedRisk.notes.map((note) => (
                    <article key={note}>
                      <p>{note}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="button-row">
                {owners.map((owner) => (
                  <Button
                    key={owner}
                    variant="secondary"
                    onClick={() => void setRiskStatus(selectedRisk.id, "Assigned", owner)}
                  >
                    Assign {owner.split(" ")[0]}
                  </Button>
                ))}
                <Button variant="primary" onClick={() => void setRiskStatus(selectedRisk.id, "Monitoring")}>
                  Move to monitoring
                </Button>
                <Button variant="ghost" onClick={() => void setRiskStatus(selectedRisk.id, "Cleared")}>
                  Clear signal
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState title="No active signals" description="Cleared items are removed from the live board." />
          )}
        </Panel>
      </section>
    </div>
  );
}
