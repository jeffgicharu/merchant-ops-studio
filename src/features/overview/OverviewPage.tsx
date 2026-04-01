import { useOpsData } from "../../app/OpsDataContext";
import { DistributionBars } from "../../components/charts/DistributionBars";
import { TrendChart } from "../../components/charts/TrendChart";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { MetricCard } from "../../components/ui/MetricCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { Panel } from "../../components/ui/Panel";
import { formatCompactMoney, formatMoney } from "../../lib/formatters";
import { getMerchantName, getOverviewMetricCards, getStatusTone } from "../../lib/selectors";

export function OverviewPage() {
  const { snapshot, resetWorkspace } = useOpsData();

  if (!snapshot) {
    return <div className="screen-state">Loading workspace...</div>;
  }

  const metrics = getOverviewMetricCards(snapshot);
  const highRiskMerchants = [...snapshot.merchants]
    .sort((left, right) => right.riskScore - left.riskScore)
    .slice(0, 4)
    .map((merchant) => ({
      id: merchant.id,
      label: merchant.name,
      value: merchant.riskScore,
      tone: getStatusTone(merchant.status)
    }));

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Executive summary"
        title="One workspace for disputes, risk, merchant health, and settlement decisions"
        description="Payment teams often work across issuer portals, fraud tools, treasury sheets, and merchant notes. This workspace consolidates the operating picture so teams can assess risk and act without losing context."
        actions={
          <Button variant="secondary" onClick={() => void resetWorkspace()}>
            Reset scenario
          </Button>
        }
      />

      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </section>

      <section className="dashboard-grid dashboard-grid--hero">
        <Panel
          title="Weekly processing throughput"
          subtitle="A lightweight SVG chart instead of a charting dependency to keep the frontend deliberate and portable."
          className="panel--wide"
        >
          <TrendChart data={snapshot.throughputTrend} label="Weekly processing throughput" />
        </Panel>

        <Panel
          title="Risk watchlist"
          subtitle="Top merchant portfolios needing attention"
          accent="teal"
        >
          <DistributionBars items={highRiskMerchants} />
        </Panel>
      </section>

      <section className="dashboard-grid">
        <Panel title="Live operations feed" subtitle="Recent actions across ops, risk, support, and treasury">
          <div className="activity-feed">
            {snapshot.activity.map((item) => (
              <article key={item.id} className="activity-feed__item">
                <div>
                  <Badge tone={item.tone}>{item.at}</Badge>
                </div>
                <div>
                  <h4>{item.action}</h4>
                  <p>
                    {item.actor} on <strong>{item.subject}</strong>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Settlement exposure" subtitle="Batches that can affect treasury timing" accent="ink">
          <div className="summary-list">
            {snapshot.settlements.map((batch) => (
              <div key={batch.id} className="summary-list__row">
                <div>
                  <h4>{getMerchantName(snapshot, batch.merchantId)}</h4>
                  <p>
                    {batch.channel} payout for {batch.scheduledFor}
                  </p>
                </div>
                <div className="summary-list__value">
                  <Badge tone={getStatusTone(batch.status)}>{batch.status}</Badge>
                  <strong>{formatMoney(batch.amount, batch.currency)}</strong>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="dashboard-grid">
        <Panel title="Operating principles" subtitle="How the workspace is structured to reduce context switching">
          <div className="feature-points">
            <article>
              <h4>Shared operational language</h4>
              <p>Status, severity, and health indicators use the same visual grammar across modules.</p>
            </article>
            <article>
              <h4>Queue plus detail workflow</h4>
              <p>Operators can review lists, inspect context, and take action without jumping between views.</p>
            </article>
            <article>
              <h4>Backend-ready state model</h4>
              <p>Async client boundaries, action flows, and derived selectors keep the interface ready for live APIs.</p>
            </article>
          </div>
        </Panel>

        <Panel title="Priority incidents" subtitle="Cases requiring same-day attention" accent="teal">
          <div className="priority-list">
            {snapshot.riskCases.map((riskCase) => (
              <article key={riskCase.id} className="priority-list__item">
                <div>
                  <Badge tone={getStatusTone(riskCase.severity)}>{riskCase.severity}</Badge>
                  <h4>{riskCase.title}</h4>
                </div>
                <p>{riskCase.signal}</p>
                <strong>{formatCompactMoney(riskCase.expectedLoss)}</strong>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
