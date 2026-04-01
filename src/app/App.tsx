import { RouterProvider } from "react-router-dom";

import { OpsDataProvider } from "./OpsDataContext";
import { router } from "./router";

export function App() {
  return (
    <OpsDataProvider>
      <RouterProvider router={router} />
    </OpsDataProvider>
  );
}
