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
    litters,
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
      (l) => l.avg_weight !== undefined && l.avg_weight > 0
    );
    if (validLitters.length === 0) return 0;
    const total = validLitters.reduce((sum, l) => sum + (l.avg_weight || 0), 0);
    return Number((total / validLitters.length).toFixed(2));
  }, [litters]);

  const avgPigletsBorn = useMemo(() => {
    const validLitters = litters.filter(
      (l) => l.piglets_born_count !== undefined && l.piglets_born_count > 0
    );
    if (validLitters.length === 0) return 0;
    const total = validLitters.reduce(
      (sum, l) => sum + (l.piglets_born_count || 0),
      0
    );
    return Number((total / validLitters.length).toFixed(1));
  }, [litters]);

  const weightTrend = useMemo(() => {
    return litters
      .filter((l) => l.avg_weight && l.avg_weight > 0 && l.sold_at)
      .sort(
        (a, b) =>
          new Date(a.sold_at!).getTime() - new Date(b.sold_at!).getTime()
      )
      .slice(-6) // Last 6 records
      .map((l) => ({
        date: l.sold_at,
        value: l.avg_weight || 0,
      }));
  }, [litters]);

  const pigletsTrend = useMemo(() => {
    return litters
      .filter((l) => l.piglets_born_count && l.birth_date)
      .sort(
        (a, b) =>
          new Date(a.birth_date!).getTime() - new Date(b.birth_date!).getTime()
      )
      .slice(-6)
      .map((l) => ({
        date: l.birth_date,
        value: l.piglets_born_count || 0,
      }));
  }, [litters]);

  const breedingTrend = useMemo(() => {
    const allBreedings = sows.flatMap((s) => s.breedings || []);
    const breedingsByMonth = allBreedings.reduce((acc, b) => {
      if (!b.breed_date) return acc;
      const date = new Date(b.breed_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breedingsByMonth)
      .sort((a, b) => {
        const [yA, mA] = a[0].split("-").map(Number);
        const [yB, mB] = b[0].split("-").map(Number);
        return new Date(yA, mA).getTime() - new Date(yB, mB).getTime();
      })
      .slice(-6)
      .map(([_, count]) => ({ value: count }));
  }, [sows]);

  const pigletsCountTrend = useMemo(() => {
    const pigletsByMonth = litters.reduce((acc, l) => {
      if (!l.birth_date) return acc;
      const date = new Date(l.birth_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const count =
        (l.piglets_male_born_alive || 0) + (l.piglets_female_born_alive || 0);
      acc[key] = (acc[key] || 0) + count;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pigletsByMonth)
      .sort((a, b) => {
        const [yA, mA] = a[0].split("-").map(Number);
        const [yB, mB] = b[0].split("-").map(Number);
        return new Date(yA, mA).getTime() - new Date(yB, mB).getTime();
      })
      .slice(-6)
      .map(([_, count]) => ({ value: count }));
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
    breedingTrend,
    pigletsCountTrend,
    isLoading,
    error,
  };
}
