import { useMemo } from "react";
import { Breeding } from "@/types/breeding";
import { Litter } from "@/types/litter";

export function useSowDetailCalculations(breedings: Breeding[], litters: Litter[]) {
  const averagePigletsBornCount = useMemo(() => {
    const validBreedings = breedings.filter(
      (breeding) =>
        breeding.actual_farrow_date &&
        breeding.piglets_born_count !== null &&
        !breeding.is_aborted
    );
    
    if (validBreedings.length === 0) return 0;
    
    const total = validBreedings.reduce(
      (acc, breeding) => acc + (breeding.piglets_born_count || 0),
      0
    );
    
    return Math.floor(total / validBreedings.length);
  }, [breedings]);

  const averageWeightChart = useMemo(() => {
    const validLitters = litters.filter((litter) => litter.avg_weight && litter.avg_weight > 0);
    
    if (validLitters.length === 0) return 0;
    
    const total = validLitters.reduce((acc, litter) => acc + (litter.avg_weight || 0), 0);
    
    return Math.floor(total / validLitters.length);
  }, [litters]);

  return {
    averagePigletsBornCount,
    averageWeightChart
  };
}