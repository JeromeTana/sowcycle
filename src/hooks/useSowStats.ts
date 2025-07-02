import { useMemo } from "react";

export interface SowStats {
  total: number;
  pregnant: number;
  availableForBreeding: number;
  active: number;
  inactive: number;
}

export function useSowStats(sows: any[]): SowStats {
  return useMemo(
    () => ({
      total: sows.length,
      pregnant: sows.filter((sow) => !sow.is_available).length,
      availableForBreeding: sows.filter((sow) => sow.is_available).length,
      active: sows.filter((sow) => sow.is_active).length,
      inactive: sows.filter((sow) => !sow.is_active).length,
    }),
    [sows]
  );
}