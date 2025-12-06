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

  const avgWeight = useMemo(() => {
    const validLitters = litters.filter(
      (l) => l.avg_weight !== undefined && l.avg_weight > 0,
    );
    if (validLitters.length === 0) return 0;
    const total = validLitters.reduce((sum, l) => sum + (l.avg_weight || 0), 0);
    return Number((total / validLitters.length).toFixed(2));
  }, [litters]);

  const avgPigletsBorn = useMemo(() => {
    const validLitters = litters.filter(
      (l) => l.piglets_born_count !== undefined && l.piglets_born_count > 0,
    );
    if (validLitters.length === 0) return 0;
    const total = validLitters.reduce(
      (sum, l) => sum + (l.piglets_born_count || 0),
      0,
    );
    return Number((total / validLitters.length).toFixed(1));
  }, [litters]);

  const weightTrend = useMemo(() => {
    return litters
      .filter((l) => l.avg_weight && l.avg_weight > 0 && l.sold_at)
      .sort(
        (a, b) =>
          new Date(a.sold_at!).getTime() - new Date(b.sold_at!).getTime(),
      )
      .slice(-6) // Last 6 records
      .map((l) => ({
        date: l.sold_at,
        value: l.avg_weight,
      }));
  }, [litters]);

  const pigletsTrend = useMemo(() => {
    return litters
      .filter((l) => l.piglets_born_count && l.birth_date)
      .sort(
        (a, b) =>
          new Date(a.birth_date!).getTime() - new Date(b.birth_date!).getTime(),
      )
      .slice(-6)
      .map((l) => ({
        date: l.birth_date,
        value: l.piglets_born_count,
      }));
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
    avgWeight,
    avgPigletsBorn,
    weightTrend,
    pigletsTrend,
    isLoading,
    error,
  };
}
