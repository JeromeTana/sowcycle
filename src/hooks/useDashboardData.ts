import { useMemo } from "react";
import { useSowOperations } from "./useSowOperations";
import { useBoarOperations } from "./useBoarOperations";

export function useDashboardData() {
  const { 
    sows, 
    isLoading: sowsLoading, 
    error: sowsError 
  } = useSowOperations({ includeBreeding: true });
  
  const { 
    boars, 
    isLoading: boarsLoading, 
    error: boarsError 
  } = useBoarOperations();

  const breededSows = useMemo(() => {
    return sows
      .filter((sow) => !sow.is_available && sow.breedings?.length > 0)
      .sort((a, b) => {
        const aDate = a.breedings?.[0]?.breed_date
          ? new Date(a.breedings[0].breed_date)
          : new Date(0);
        const bDate = b.breedings?.[0]?.breed_date
          ? new Date(b.breedings[0].breed_date)
          : new Date(0);
        return aDate.getTime() - bDate.getTime();
      });
  }, [sows]);

  const isLoading = sowsLoading || boarsLoading;
  const error = sowsError || boarsError;

  return {
    sows,
    boars,
    breededSows,
    isLoading,
    error,
  };
}