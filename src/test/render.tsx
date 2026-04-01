import { render } from "@testing-library/react";
import type { PropsWithChildren, ReactElement } from "react";

import { OpsDataProvider } from "../app/OpsDataContext";

function Providers({ children }: PropsWithChildren) {
  return <OpsDataProvider>{children}</OpsDataProvider>;
}

export function renderWithProviders(ui: ReactElement) {
  return render(ui, {
    wrapper: Providers
  });
}
