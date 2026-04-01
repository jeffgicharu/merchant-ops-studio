import type { PropsWithChildren } from "react";

import { classNames } from "../../lib/utils";

interface PanelProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  accent?: "sand" | "teal" | "ink";
  className?: string;
}

export function Panel({ children, title, subtitle, accent = "sand", className }: PanelProps) {
  return (
    <section className={classNames("panel", `panel--${accent}`, className)}>
      {title ? (
        <header className="panel__header">
          <div>
            <h3>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </header>
      ) : null}
      {children}
    </section>
  );
}
