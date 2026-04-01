import type { Tone } from "../../lib/types";

import { classNames } from "../../lib/utils";

interface DistributionBar {
  id: string;
  label: string;
  value: number;
  tone: Tone;
}

interface DistributionBarsProps {
  items: DistributionBar[];
}

export function DistributionBars({ items }: DistributionBarsProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="distribution-bars">
      {items.map((item) => (
        <div key={item.id} className="distribution-bars__row">
          <div className="distribution-bars__meta">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="distribution-bars__track">
            <div
              className={classNames("distribution-bars__fill", `distribution-bars__fill--${item.tone}`)}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
