"use client";

import React, { useMemo } from "react";
import { useCalendarData } from "@/hooks/useCalendarData";
import { addDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { FarrowEventList } from "@/components/Calendar/FarrowEventList";
import { SaleableEventList } from "@/components/Calendar/SaleableEventList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const UpcomingEvents = () => {
  const { data, loading, error } = useCalendarData();
  const { farrowEvents, saleableEvents } = data;

  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date());
    const nextWeek = endOfDay(addDays(today, 7));

    const interval = { start: today, end: nextWeek };

    const farrow = farrowEvents.filter((event) =>
      isWithinInterval(event.expectedDate, interval),
    );

    const saleable = saleableEvents.filter((event) =>
      isWithinInterval(event.saleableDate, interval),
    );

    return { farrow, saleable };
  }, [farrowEvents, saleableEvents]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
      </div>
    );
  }

  const hasEvents =
    upcomingEvents.farrow.length > 0 || upcomingEvents.saleable.length > 0;

  if (!hasEvents) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">ใน 7 วัน</h2>
        <Card className="bg-white">
          <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
            ไม่มีรายการใน 7 วันข้างหน้า
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      {upcomingEvents.saleable.length > 0 && (
        <div>
          <h2 className="pb-4 font-semibold text-xl">ลูกขุนใกล้พร้อมขาย</h2>
          <SaleableEventList
            events={upcomingEvents.saleable.sort(
              (a, b) => a.saleableDate.getTime() - b.saleableDate.getTime(),
            )}
          />
        </div>
      )}
    </div>
  );
};
