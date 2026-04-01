import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { DisputesPage } from "../features/disputes/DisputesPage";
import { MerchantsPage } from "../features/merchants/MerchantsPage";
import { OverviewPage } from "../features/overview/OverviewPage";
import { PlaybookPage } from "../features/overview/PlaybookPage";
import { RiskPage } from "../features/risk/RiskPage";
import { SettlementsPage } from "../features/settlements/SettlementsPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppShell />,
      children: [
        { index: true, element: <OverviewPage /> },
        { path: "merchants", element: <MerchantsPage /> },
        { path: "disputes", element: <DisputesPage /> },
        { path: "risk", element: <RiskPage /> },
        { path: "settlements", element: <SettlementsPage /> },
        { path: "playbook", element: <PlaybookPage /> }
      ]
    }
  ],
  {
    basename: import.meta.env.BASE_URL
  }
);
