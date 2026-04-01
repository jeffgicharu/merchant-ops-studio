import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "../../test/render";
import { DisputesPage } from "./DisputesPage";

describe("DisputesPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("updates a dispute status and appends to the timeline", async () => {
    const user = userEvent.setup();

    renderWithProviders(<DisputesPage />);

    expect(await screen.findByText("dp-4102 review panel")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Refund customer" }));

    await waitFor(() => {
      expect(screen.getByText("Status changed to Refunded")).toBeInTheDocument();
    });
  });
});
