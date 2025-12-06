"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { FarrowEventList } from "@/components/Calendar/FarrowEventList";
import { SaleableEventList } from "@/components/Calendar/SaleableEventList";
import { useCalendarData } from "@/hooks/useCalendarData";
import TopBar from "@/components/TopBar";

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
    <>
      <TopBar title="Calendar" />
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-1">
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
            {loading ? (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {selectedDateEvents.farrow.length > 0 && (
                  <div>
                    <h2 className="pb-4 font-bold text-xl">กำหนดคลอด</h2>
                    <FarrowEventList events={selectedDateEvents.farrow} />
                  </div>
                )}
                {selectedDateEvents.saleable.length > 0 && (
                  <div>
                    <h2 className="pb-4 font-semibold text-xl">
                      ลูกขุนพร้อมขาย
                    </h2>
                    <SaleableEventList events={selectedDateEvents.saleable} />
                  </div>
                )}
                {selectedDateEvents.farrow.length === 0 &&
                  selectedDateEvents.saleable.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 border-gray-200">
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
    </>
  );
}
