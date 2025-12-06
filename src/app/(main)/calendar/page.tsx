"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { isSameDay, parseISO, differenceInDays } from "date-fns";
import { getAllBreedings } from "@/services/breeding";
import { getAllLitters } from "@/services/litter";
import { Breeding } from "@/types/breeding";
import { cn } from "@/lib/utils";
import { FarrowEventList } from "@/components/Calendar/FarrowEventList";
import { SaleableEventList } from "@/components/Calendar/SaleableEventList";

interface FarrowEvent {
  id: number;
  sowId: number;
  sowName: string;
  expectedDate: Date;
  breedDate: Date;
  daysUntilFarrow: number;
  isOverdue: boolean;
  actualFarrowDate?: Date;
}

interface SaleableEvent {
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

interface CalendarData {
  breedings: Breeding[];
  farrowEvents: FarrowEvent[];
  saleableEvents: SaleableEvent[];
}

// Custom hook for calendar data
const useCalendarData = () => {
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

// Main component
export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const { data, loading, error } = useCalendarData();
  const { farrowEvents, saleableEvents } = data;

  // Memoized filtered events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return { farrow: [], saleable: [] };

    return {
      farrow: farrowEvents.filter((event) =>
        isSameDay(event.expectedDate, selectedDate),
      ),
      saleable: saleableEvents.filter((event) =>
        isSameDay(event.saleableDate, selectedDate),
      ),
    };
  }, [selectedDate, farrowEvents, saleableEvents]);

  // Memoized calendar modifiers
  const calendarModifiers = useMemo(
    () => ({
      hasEvent: (date: Date) =>
        farrowEvents.some((event) => isSameDay(event.expectedDate, date)),
      overdue: (date: Date) =>
        farrowEvents.some(
          (event) => isSameDay(event.expectedDate, date) && event.isOverdue,
        ),
      hasSaleableEvent: (date: Date) =>
        saleableEvents.some((event) => isSameDay(event.saleableDate, date)),
      saleablePastDue: (date: Date) =>
        saleableEvents.some(
          (event) => isSameDay(event.saleableDate, date) && event.isPastDue,
        ),
    }),
    [farrowEvents, saleableEvents],
  );

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-1">
            <Calendar
              mode="single"
              disabled={loading}
              numberOfMonths={1}
              selected={selectedDate}
              onSelect={handleDateSelect}
              defaultMonth={new Date()}
              className={cn(
                "w-full flex justify-center",
                loading && "animate-pulse",
              )}
              modifiers={calendarModifiers}
              modifiersClassNames={{
                hasEvent:
                  "bg-pink-500 text-white hover:bg-pink-600 hover:text-white",
                overdue:
                  "bg-pink-500 text-white hover:bg-pink-600 hover:text-white",
                hasSaleableEvent:
                  "bg-green-500 text-white hover:bg-green-600 hover:text-white",
                saleablePastDue:
                  "bg-green-500 text-white hover:bg-green-600 hover:text-white",
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          {!loading && (
            <div>
              <FarrowEventList events={selectedDateEvents.farrow} />
              <SaleableEventList events={selectedDateEvents.saleable} />

              {selectedDateEvents.farrow.length === 0 &&
                selectedDateEvents.saleable.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border-gray-200">
                    <p className="text-muted-foreground">
                      ไม่มีรายการในวันที่นี้
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
