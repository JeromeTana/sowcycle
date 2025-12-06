import { useMemo } from "react";
import { useSowOperations } from "./useSowOperations";
import { useBoarOperations } from "./useBoarOperations";
import { useLitterData } from "./useLitterData";

export function useDashboardData() {
  const {
    sows,
    isLoading: sowsLoading,
    error: sowsError,
  } = useSowOperations({ includeBreeding: true });

  const {
    boars,
    isLoading: boarsLoading,
    error: boarsError,
  } = useBoarOperations();

  const {
    littersWithBreeds: litters,
    isLoading: littersLoading,
    error: littersError,
  } = useLitterData();

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

  const pregnantSowsCount = breededSows.length;

  const pigletsCount = useMemo(() => {
    return litters
      .filter((litter) => !litter.sold_at)
      .reduce((total, litter) => {
        const male = litter.piglets_male_born_alive || 0;
        const female = litter.piglets_female_born_alive || 0;
        return total + male + female;
      }, 0);
  }, [litters]);

  const isLoading = sowsLoading || boarsLoading || littersLoading;
  const error = sowsError || boarsError || littersError;

  return {
    sows,
    boars,
    litters,
    breededSows,
    pregnantSowsCount,
    pigletsCount,
    isLoading,
    error,
  };
}
