import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useOpsData } from "../../app/OpsDataContext";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { formatMoney } from "../../lib/formatters";
import { getMerchantName, getStatusTone } from "../../lib/selectors";
import type { Dispute } from "../../lib/types";

const statusOptions = ["All", "Needs review", "Representing", "Refunded", "Accepted liability"] as const;

export function DisputesPage() {
  const { snapshot, setDisputeStatus } = useOpsData();
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("All");
  const [query, setQuery] = useState("");
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const disputes = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    return snapshot.disputes.filter((dispute) => {
      const merchantName = getMerchantName(snapshot, dispute.merchantId);
      const matchesStatus = statusFilter === "All" || dispute.status === statusFilter;
      const matchesQuery =
        dispute.reason.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        merchantName.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        dispute.id.toLowerCase().includes(deferredQuery.toLowerCase());

      return matchesStatus && matchesQuery;
    });
  }, [deferredQuery, snapshot, statusFilter]);

  useEffect(() => {
    if (!disputes.length) {
      setSelectedDisputeId(null);
      return;
    }

    if (!selectedDisputeId || !disputes.some((dispute) => dispute.id === selectedDisputeId)) {
      setSelectedDisputeId(disputes[0].id);
    }
  }, [disputes, selectedDisputeId]);

  if (!snapshot) {
    return <div className="screen-state">Loading workspace...</div>;
  }

  const selectedDispute = disputes.find((dispute) => dispute.id === selectedDisputeId) ?? disputes[0];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Disputes workflow"
        title="Actionable queue with evidence context and operator decisions"
        description="This screen is designed like a real operations desk: the left side handles queue management and the right side supports decisions without context switching."
      />

      <section className="dashboard-grid dashboard-grid--split">
        <Panel title="Active dispute queue" subtitle="Filterable workbench for card and wallet disputes">
          <div className="control-row">
            <label className="field">
              <span>Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by dispute, merchant, or reason"
              />
            </label>
            <div className="pill-group">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  className={`pill ${statusFilter === option ? "pill--active" : ""}`}
                  onClick={() => setStatusFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <DataTable<Dispute>
            rows={disputes}
            getRowKey={(dispute) => dispute.id}
            selectedRowId={selectedDispute?.id}
            onRowClick={(dispute) => setSelectedDisputeId(dispute.id)}
            emptyState={
              <EmptyState title="Queue empty" description="There are no disputes for the selected filters." />
            }
            columns={[
              {
                key: "id",
                header: "Case",
                render: (dispute) => (
                  <div>
                    <strong>{dispute.id}</strong>
                    <p className="table-muted">{getMerchantName(snapshot, dispute.merchantId)}</p>
                  </div>
                )
              },
              {
                key: "reason",
                header: "Reason",
                render: (dispute) => dispute.reason
              },
              {
                key: "priority",
                header: "Priority",
                render: (dispute) => <Badge tone={getStatusTone(dispute.priority)}>{dispute.priority}</Badge>
              },
              {
                key: "amount",
                header: "Amount",
                render: (dispute) => formatMoney(dispute.amount)
              },
              {
                key: "status",
                header: "Status",
                render: (dispute) => <Badge tone={getStatusTone(dispute.status)}>{dispute.status}</Badge>
              }
            ]}
          />
        </Panel>

        <Panel
          title={selectedDispute ? `${selectedDispute.id} review panel` : "Dispute detail"}
          subtitle={selectedDispute ? selectedDispute.reason : "Select a dispute"}
          accent="ink"
        >
          {selectedDispute ? (
            <div className="detail-rail">
              <div className="detail-rail__hero">
                <Badge tone={getStatusTone(selectedDispute.status)}>{selectedDispute.status}</Badge>
                <Badge tone={getStatusTone(selectedDispute.priority)}>{selectedDispute.priority}</Badge>
              </div>

              <div className="summary-list">
                <div className="summary-list__row">
                  <span>Merchant</span>
                  <strong>{getMerchantName(snapshot, selectedDispute.merchantId)}</strong>
                </div>
                <div className="summary-list__row">
                  <span>Customer</span>
                  <strong>{selectedDispute.customer}</strong>
                </div>
                <div className="summary-list__row">
                  <span>Scheme</span>
                  <strong>{selectedDispute.scheme}</strong>
                </div>
                <div className="summary-list__row">
                  <span>Deadline</span>
                  <strong>{selectedDispute.dueAt.slice(0, 10)}</strong>
                </div>
              </div>

              <div>
                <p className="eyebrow">Evidence checklist</p>
                <div className="feature-points">
                  {selectedDispute.evidence.map((item) => (
                    <article key={item}>
                      <p>{item}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <p className="eyebrow">Timeline</p>
                <div className="timeline">
                  {selectedDispute.timeline.map((item) => (
                    <div key={item.id} className="timeline__item">
                      <div className="timeline__dot" />
                      <div>
                        <h4>{item.label}</h4>
                        <p>{item.at}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="button-row">
                <Button variant="secondary" onClick={() => void setDisputeStatus(selectedDispute.id, "Representing")}>
                  Represent
                </Button>
                <Button variant="primary" onClick={() => void setDisputeStatus(selectedDispute.id, "Refunded")}>
                  Refund customer
                </Button>
                <Button variant="ghost" onClick={() => void setDisputeStatus(selectedDispute.id, "Accepted liability")}>
                  Accept liability
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Select a dispute"
              description="Use the queue to inspect evidence and trigger a workflow action."
            />
          )}
        </Panel>
      </section>
    </div>
  );
}
