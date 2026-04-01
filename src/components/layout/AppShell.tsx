import { NavLink, Outlet } from "react-router-dom";

import { useOpsData } from "../../app/OpsDataContext";
import { getNavCounts } from "../../lib/selectors";
import { classNames } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const navigation = [
  { to: "/", label: "Overview", exact: true },
  { to: "/merchants", label: "Merchants" },
  { to: "/disputes", label: "Disputes", countKey: "disputes" as const },
  { to: "/risk", label: "Risk", countKey: "risk" as const },
  { to: "/settlements", label: "Settlements", countKey: "settlements" as const },
  { to: "/playbook", label: "Playbook" }
];

export function AppShell() {
  const { snapshot, loading, error, banner, clearBanner, refresh } = useOpsData();
  const counts = snapshot ? getNavCounts(snapshot) : null;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <div className="brand-mark__icon">M</div>
          <div>
            <p className="eyebrow">Operations Suite</p>
            <h1>Merchant Ops Studio</h1>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => classNames("sidebar-link", isActive && "is-active")}
            >
              <span>{item.label}</span>
              {item.countKey && counts ? <Badge tone="critical">{counts[item.countKey]}</Badge> : null}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Operating model</p>
          <p>
            Centralizes merchant monitoring, dispute review, risk triage, and payout control so
            operations teams can move from signal to action without switching tools.
          </p>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Internal workspace</p>
            <h2>Payment operations cockpit</h2>
          </div>

          <div className="topbar__meta">
            <Badge tone={loading ? "warning" : "positive"}>
              {loading ? "Refreshing data" : "System healthy"}
            </Badge>
            <Badge tone="neutral">Focus: Merchant operations</Badge>
            <Button variant="ghost" onClick={() => void refresh()}>
              Sync workspace
            </Button>
          </div>
        </header>

        {error ? <div className="inline-alert inline-alert--critical">{error}</div> : null}
        {banner ? (
          <div className="inline-alert inline-alert--positive">
            <span>{banner}</span>
            <button className="inline-alert__close" onClick={clearBanner} aria-label="Dismiss message">
              Close
            </button>
          </div>
        ) : null}

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
