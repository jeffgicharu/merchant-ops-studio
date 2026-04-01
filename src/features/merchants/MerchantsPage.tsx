import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";

import { useOpsData } from "../../app/OpsDataContext";
import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { Badge } from "../../components/ui/Badge";
import { formatCompactMoney, formatPercent } from "../../lib/formatters";
import { getStatusTone } from "../../lib/selectors";
import type { Merchant } from "../../lib/types";

const tierOptions = ["All", "Strategic", "Growth", "Watch"] as const;

export function MerchantsPage() {
  const { snapshot } = useOpsData();
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<(typeof tierOptions)[number]>("All");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search);

  const filteredMerchants = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    return snapshot.merchants.filter((merchant) => {
      const matchesSearch =
        merchant.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        merchant.city.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        merchant.owner.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesTier = tier === "All" || merchant.tier === tier;

      return matchesSearch && matchesTier;
    });
  }, [deferredSearch, snapshot, tier]);

  useEffect(() => {
    if (!filteredMerchants.length) {
      setSelectedMerchantId(null);
      return;
    }

    if (!selectedMerchantId || !filteredMerchants.some((merchant) => merchant.id === selectedMerchantId)) {
      setSelectedMerchantId(filteredMerchants[0].id);
    }
  }, [filteredMerchants, selectedMerchantId]);

  if (!snapshot) {
    return <div className="screen-state">Loading workspace...</div>;
  }

  const selectedMerchant =
    filteredMerchants.find((merchant) => merchant.id === selectedMerchantId) ?? filteredMerchants[0];
  const healthyCount = snapshot.merchants.filter((merchant) => merchant.status === "Healthy").length;
  const flaggedCount = snapshot.merchants.filter((merchant) => merchant.status !== "Healthy").length;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Merchant operations"
        title="Merchant monitoring, relationship coverage, and operational health"
        description="Searchable merchant oversight view with reusable table patterns, deferred filtering, and a detail rail that surfaces the business context behind each account."
      />

      <section className="dashboard-grid dashboard-grid--summary">
        <Panel accent="teal">
          <p className="eyebrow">Healthy merchants</p>
          <strong className="spot-value">{healthyCount}</strong>
        </Panel>
        <Panel accent="sand">
          <p className="eyebrow">Escalated merchants</p>
          <strong className="spot-value">{flaggedCount}</strong>
        </Panel>
        <Panel accent="ink">
          <p className="eyebrow">Combined monthly volume</p>
          <strong className="spot-value">
            {formatCompactMoney(snapshot.merchants.reduce((total, merchant) => total + merchant.monthlyVolume, 0))}
          </strong>
        </Panel>
      </section>

      <section className="dashboard-grid dashboard-grid--split">
        <Panel title="Merchant directory" subtitle="Filter by tier, region, relationship owner, or search terms">
          <div className="control-row">
            <label className="field">
              <span>Search</span>
              <input
                value={search}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  startTransition(() => {
                    setSearch(nextValue);
                  });
                }}
                placeholder="Merchant, city, or owner"
              />
            </label>
            <div className="pill-group" aria-label="Tier filter">
              {tierOptions.map((option) => (
                <button
                  key={option}
                  className={`pill ${tier === option ? "pill--active" : ""}`}
                  onClick={() => setTier(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <DataTable<Merchant>
            rows={filteredMerchants}
            getRowKey={(merchant) => merchant.id}
            selectedRowId={selectedMerchant?.id}
            onRowClick={(merchant) => setSelectedMerchantId(merchant.id)}
            emptyState={
              <EmptyState
                title="No merchants match the current filters"
                description="Try another owner, city, or merchant tier."
              />
            }
            columns={[
              {
                key: "name",
                header: "Merchant",
                render: (merchant) => (
                  <div>
                    <strong>{merchant.name}</strong>
                    <p className="table-muted">
                      {merchant.segment} · {merchant.city}
                    </p>
                  </div>
                )
              },
              {
                key: "status",
                header: "Health",
                render: (merchant) => <Badge tone={getStatusTone(merchant.status)}>{merchant.status}</Badge>
              },
              {
                key: "owner",
                header: "Owner",
                render: (merchant) => merchant.owner
              },
              {
                key: "volume",
                header: "Monthly volume",
                render: (merchant) => formatCompactMoney(merchant.monthlyVolume)
              },
              {
                key: "risk",
                header: "Risk score",
                render: (merchant) => merchant.riskScore
              }
            ]}
          />
        </Panel>

        <Panel
          title={selectedMerchant ? selectedMerchant.name : "Merchant detail"}
          subtitle={selectedMerchant ? `${selectedMerchant.segment} · ${selectedMerchant.region}` : "Select a merchant"}
          accent="teal"
        >
          {selectedMerchant ? (
            <div className="detail-rail">
              <div className="detail-rail__hero">
                <Badge tone={getStatusTone(selectedMerchant.status)}>{selectedMerchant.status}</Badge>
                <Badge tone={getStatusTone(selectedMerchant.settlementHealth)}>
                  {selectedMerchant.settlementHealth}
                </Badge>
              </div>

              <div className="summary-list">
                <div className="summary-list__row">
                  <span>Relationship owner</span>
                  <strong>{selectedMerchant.owner}</strong>
                </div>
                <div className="summary-list__row">
                  <span>Authentication rate</span>
                  <strong>{formatPercent(selectedMerchant.authRate)}</strong>
                </div>
                <div className="summary-list__row">
                  <span>Dispute rate</span>
                  <strong>{formatPercent(selectedMerchant.disputeRate)}</strong>
                </div>
                <div className="summary-list__row">
                  <span>Integration status</span>
                  <strong>{selectedMerchant.integrationStatus}</strong>
                </div>
                <div className="summary-list__row">
                  <span>MCC</span>
                  <strong>{selectedMerchant.mcc}</strong>
                </div>
              </div>

              <div>
                <p className="eyebrow">Payment channels</p>
                <div className="badge-row">
                  {selectedMerchant.channels.map((channel) => (
                    <Badge key={channel}>{channel}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="eyebrow">Account notes</p>
                <div className="feature-points">
                  {selectedMerchant.notes.map((note) => (
                    <article key={note}>
                      <p>{note}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Select a merchant"
              description="Use the directory table to inspect operational health and account notes."
            />
          )}
        </Panel>
      </section>
    </div>
  );
}
