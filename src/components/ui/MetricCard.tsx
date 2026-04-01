import type { MetricCard as MetricCardType } from "../../lib/types";
import { classNames } from "../../lib/utils";

export function MetricCard({ label, value, detail, trend, tone }: MetricCardType) {
  return (
    <article className={classNames("metric-card", `metric-card--${tone}`)}>
      <p className="metric-card__label">{label}</p>
      <strong className="metric-card__value">{value}</strong>
      <p className="metric-card__detail">{detail}</p>
      <span className="metric-card__trend">{trend}</span>
    </article>
  );
}
