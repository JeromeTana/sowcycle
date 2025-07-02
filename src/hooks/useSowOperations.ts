import { useEffect, useState } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { getAllSows, getAllSowsWithLatestBreeding } from "@/services/sow";

interface UseSowOperationsOptions {
  includeBreeding?: boolean;
  autoFetch?: boolean;
}

export function useSowOperations(options: UseSowOperationsOptions = {}) {
  const { includeBreeding = false, autoFetch = true } = options;
  const { sows, setSows } = useSowStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSows = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const sowsData = includeBreeding
        ? await getAllSowsWithLatestBreeding()
        : await getAllSows();

      if (sowsData) {
        setSows(sowsData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch sows";
      setError(errorMessage);
      console.error("Failed to fetch sows:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && sows.length === 0) {
      fetchSows();
    }
  }, [autoFetch, includeBreeding]);

  return {
    sows,
    isLoading,
    error,
    refetch: fetchSows,
  };
}
