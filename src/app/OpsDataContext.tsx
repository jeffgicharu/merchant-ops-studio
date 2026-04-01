import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from "react";

import {
  loadSnapshot,
  resetSnapshot,
  updateDisputeStatus,
  updateRiskCase,
  updateSettlementStatus
} from "../lib/merchantOpsClient";
import type { DisputeStatus, OpsSnapshot, RiskStatus, SettlementStatus } from "../lib/types";

interface OpsDataContextValue {
  snapshot: OpsSnapshot | null;
  loading: boolean;
  error: string | null;
  banner: string | null;
  refresh: () => Promise<void>;
  clearBanner: () => void;
  resetWorkspace: () => Promise<void>;
  setDisputeStatus: (id: string, status: DisputeStatus) => Promise<void>;
  setRiskStatus: (id: string, status: RiskStatus, owner?: string | null) => Promise<void>;
  setSettlementStatus: (id: string, status: SettlementStatus) => Promise<void>;
}

const OpsDataContext = createContext<OpsDataContextValue | undefined>(undefined);

export function OpsDataProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<OpsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const nextSnapshot = await loadSnapshot();
      startTransition(() => {
        setSnapshot(nextSnapshot);
      });
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Failed to load workspace");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    void loadSnapshot()
      .then((nextSnapshot) => {
        startTransition(() => {
          setSnapshot(nextSnapshot);
        });
      })
      .catch((refreshError) => {
        setError(refreshError instanceof Error ? refreshError.message : "Failed to load workspace");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function runAction(action: () => Promise<{ summary: string }>) {
    setError(null);

    try {
      const response = await action();
      const nextSnapshot = await loadSnapshot();
      startTransition(() => {
        setSnapshot(nextSnapshot);
        setBanner(response.summary);
      });
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Something went wrong");
    }
  }

  const value: OpsDataContextValue = {
    snapshot,
    loading,
    error,
    banner,
    refresh,
    clearBanner: () => setBanner(null),
    resetWorkspace: async () => {
      await runAction(resetSnapshot);
    },
    setDisputeStatus: async (id, status) => {
      await runAction(() => updateDisputeStatus(id, status));
    },
    setRiskStatus: async (id, status, owner) => {
      await runAction(() => updateRiskCase(id, status, owner));
    },
    setSettlementStatus: async (id, status) => {
      await runAction(() => updateSettlementStatus(id, status));
    }
  };

  return <OpsDataContext.Provider value={value}>{children}</OpsDataContext.Provider>;
}

export function useOpsData() {
  const context = useContext(OpsDataContext);

  if (!context) {
    throw new Error("useOpsData must be used within OpsDataProvider");
  }

  return context;
}
