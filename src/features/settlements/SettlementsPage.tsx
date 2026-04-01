import { useOpsData } from "../../app/OpsDataContext";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { formatCompactMoney, formatMoney } from "../../lib/formatters";
import { getMerchantName, getStatusTone } from "../../lib/selectors";
import type { SettlementBatch } from "../../lib/types";

export function SettlementsPage() {
  const { snapshot, setSettlementStatus } = useOpsData();

  if (!snapshot) {
    return <div className="screen-state">Loading workspace...</div>;
  }

  const heldValue = snapshot.settlements
    .filter((settlement) => settlement.status === "On hold")
    .reduce((total, settlement) => total + settlement.amount, 0);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Settlement planning"
        title="Treasury-aware payout control surface"
        description="The final module ties together merchant performance, reserves, and release decisions. This demonstrates cross-functional UI thinking, not just CRUD tables."
      />

      <section className="dashboard-grid dashboard-grid--summary">
        <Panel accent="teal">
          <p className="eyebrow">Held payout value</p>
          <strong className="spot-value">{formatCompactMoney(heldValue)}</strong>
        </Panel>
        <Panel accent="sand">
          <p className="eyebrow">Released batches</p>
          <strong className="spot-value">
            {snapshot.settlements.filter((settlement) => settlement.status === "Released").length}
          </strong>
        </Panel>
        <Panel accent="ink">
          <p className="eyebrow">Next payout cycle</p>
          <strong className="spot-value">01 Apr 2026</strong>
        </Panel>
      </section>

      <section className="dashboard-grid">
        <Panel title="Upcoming batches" subtitle="Hold and release controls with clear reserve impact">
          <DataTable<SettlementBatch>
            rows={snapshot.settlements}
            getRowKey={(batch) => batch.id}
            columns={[
              {
                key: "merchant",
                header: "Merchant",
                render: (batch) => (
                  <div>
                    <strong>{getMerchantName(snapshot, batch.merchantId)}</strong>
                    <p className="table-muted">{batch.channel}</p>
                  </div>
                )
              },
              {
                key: "scheduledFor",
                header: "Scheduled",
                render: (batch) => batch.scheduledFor
              },
              {
                key: "amount",
                header: "Amount",
                render: (batch) => formatMoney(batch.amount, batch.currency)
              },
              {
                key: "status",
                header: "Status",
                render: (batch) => <Badge tone={getStatusTone(batch.status)}>{batch.status}</Badge>
              },
              {
                key: "reserve",
                header: "Reserve impact",
                render: (batch) => formatCompactMoney(batch.reserveImpact)
              },
              {
                key: "actions",
                header: "Action",
                render: (batch) =>
                  batch.status === "On hold" ? (
                    <Button variant="primary" onClick={() => void setSettlementStatus(batch.id, "Released")}>
                      Release
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={() => void setSettlementStatus(batch.id, "On hold")}>
                      Hold
                    </Button>
                  )
              }
            ]}
          />
        </Panel>
      </section>
    </div>
  );
}
