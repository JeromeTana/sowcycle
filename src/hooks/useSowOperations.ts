import { useEffect } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { getAllSows } from "@/services/sow";

export function useSowOperations() {
  const { sows, setSows } = useSowStore();

  useEffect(() => {
    const fetchSowsData = async () => {
      try {
        const sowsData = await getAllSows();
        if (sowsData) {
          setSows(sowsData);
        }
      } catch (error) {
        console.error("Failed to fetch sows:", error);
      }
    };

    if (sows.length === 0) {
      fetchSowsData();
    }
  }, [sows.length, setSows]);

  return { sows };
}
