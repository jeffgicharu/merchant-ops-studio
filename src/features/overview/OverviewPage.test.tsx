import { screen } from "@testing-library/react";

import { renderWithProviders } from "../../test/render";
import { OverviewPage } from "./OverviewPage";

describe("OverviewPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the executive dashboard metrics", async () => {
    renderWithProviders(<OverviewPage />);

    expect(await screen.findByText("Monthly merchant volume")).toBeInTheDocument();
    expect(screen.getByText("Weekly processing throughput")).toBeInTheDocument();
    expect(screen.getByText("Live operations feed")).toBeInTheDocument();
  });
});
