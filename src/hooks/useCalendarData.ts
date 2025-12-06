import { useState, useCallback, useEffect } from "react";
import { parseISO, differenceInDays } from "date-fns";
import { getAllBreedings } from "@/services/breeding";
import { getAllLitters } from "@/services/litter";
import { Breeding } from "@/types/breeding";

export interface FarrowEvent {
  id: number;
  sowId: number;
  sowName: string;
  expectedDate: Date;
  breedDate: Date;
  daysUntilFarrow: number;
  isOverdue: boolean;
  actualFarrowDate?: Date;
}

export interface SaleableEvent {
  id: number;
  litterId: number;
  sowId: number;
  sowName: string;
  saleableDate: Date;
  daysUntilSaleable: number;
  isPastDue: boolean;
  farrowDate: Date;
  boarBreed: string;
}

export interface CalendarData {
  breedings: Breeding[];
  farrowEvents: FarrowEvent[];
  saleableEvents: SaleableEvent[];
}

export const useCalendarData = () => {
  const [data, setData] = useState<CalendarData>({
    breedings: [],
    farrowEvents: [],
    saleableEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformBreedingsToEvents = useCallback(
    (breedings: Breeding[]): FarrowEvent[] => {
      return breedings.map((breeding) => {
        const expectedDate = parseISO(breeding.expected_farrow_date);
        const breedDate = parseISO(breeding.breed_date);
        const today = new Date();
        const daysUntilFarrow = differenceInDays(expectedDate, today);

        return {
          id: breeding.id!,
          sowId: breeding.sow_id,
          sowName: (breeding as any).sows?.name || `Sow #${breeding.sow_id}`,
          expectedDate,
          breedDate,
          daysUntilFarrow,
          isOverdue: daysUntilFarrow < 0 && !breeding.actual_farrow_date,
          actualFarrowDate: breeding.actual_farrow_date
            ? parseISO(breeding.actual_farrow_date)
            : undefined,
        };
      });
    },
    [],
  );

  const transformLittersToSaleableEvents = useCallback(
    (litters: any[]): SaleableEvent[] => {
      return litters
        .filter((litter) => litter.saleable_at)
        .map((litter) => {
          const saleableDate = parseISO(litter.saleable_at!);
          const farrowDate = parseISO(litter.saleable_at!);
          const today = new Date();
          const daysUntilSaleable = differenceInDays(saleableDate, today);

          return {
            id: litter.id!,
            litterId: litter.id!,
            sowId: litter.sow_id,
            sowName: (litter as any).sows?.name || `Sow #${litter.sow_id}`,
            saleableDate,
            daysUntilSaleable,
            isPastDue: daysUntilSaleable < 0,
            farrowDate,
            boarBreed: litter.boars?.breed || "",
          };
        });
    },
    [],
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [breedings, litters] = await Promise.all([
        getAllBreedings(),
        getAllLitters(),
      ]);

      const farrowEvents = transformBreedingsToEvents(breedings);
      const saleableEvents = transformLittersToSaleableEvents(litters);

      setData({
        breedings,
        farrowEvents,
        saleableEvents,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch calendar data",
      );
    } finally {
      setLoading(false);
    }
  }, [transformBreedingsToEvents, transformLittersToSaleableEvents]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
