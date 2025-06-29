"use client";

import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Heart,
  Clock,
  AlertTriangle,
  CalendarHeart,
  Clock1,
  Check,
  CalendarIcon,
} from "lucide-react";
import {
  format,
  isToday,
  isSameDay,
  parseISO,
  differenceInDays,
} from "date-fns";
import { getAllBreedings } from "@/services/breeding";
import { Breeding } from "@/types/breeding";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DialogComponent from "@/components/DialogComponent";
import { FarrowForm } from "@/components/Breeding/Form";
import InfoIcon from "@/components/InfoIcon";

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

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [breedings, setBreedings] = useState<Breeding[]>([]);
  const [farrowEvents, setFarrowEvents] = useState<FarrowEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreedings = async () => {
    try {
      setLoading(true);
      const data = await getAllBreedings();
      setBreedings(data);

      // Transform breedings into farrow events
      const events: FarrowEvent[] = data.map((breeding) => {
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

      setFarrowEvents(events);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch breeding data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreedings();
  }, []);

  // Get events for selected date
  const selectedDateEvents = farrowEvents.filter(
    (event) => selectedDate && isSameDay(event.expectedDate, selectedDate)
  );

  // Get upcoming events (next 7 days)
  const upcomingEvents = farrowEvents
    .filter(
      (event) =>
        event.daysUntilFarrow >= 0 &&
        event.daysUntilFarrow <= 7 &&
        !event.actualFarrowDate
    )
    .sort((a, b) => a.daysUntilFarrow - b.daysUntilFarrow);

  // Get overdue events
  const overdueEvents = farrowEvents.filter((event) => event.isOverdue);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </div>
    );
  }

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <Calendar
            mode="single"
            numberOfMonths={1}
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              setSelectedDate(date);
            }}
            defaultMonth={new Date()}
            className="rounded-xl bg-white"
            modifiers={{
              hasEvent: (date) =>
                farrowEvents.some((event) =>
                  isSameDay(event.expectedDate, date)
                ),
              overdue: (date) =>
                farrowEvents.some(
                  (event) =>
                    isSameDay(event.expectedDate, date) && event.isOverdue
                ),
            }}
            modifiersClassNames={{
              hasEvent: "bg-pink-500 text-white",
              overdue: "bg-red-500 text-white",
            }}
          />
          <p className="py-6 font-bold text-lg">
            {format(selectedDate!, "d MMMM yyyy")}{" "}
            <span className="text-sm text-muted-foreground font-normal">
              {selectedDateEvents.length > 0 &&
                (selectedDateEvents[0].daysUntilFarrow >= 0
                  ? `(อีก ${selectedDateEvents[0].daysUntilFarrow + 1} วัน)`
                  : `(ผ่านมา ${Math.abs(
                      selectedDateEvents[0].daysUntilFarrow
                    )} วัน)`)}
            </span>
          </p>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="p-6 rounded-xl bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{event.sowName}</span>
                  </div>
                  <div className="mt-6">
                    {event.actualFarrowDate && (
                      <InfoIcon
                        label="คลอดจริงเมื่อ"
                        icon={<CalendarIcon className="h-5 w-5" />}
                        className="text-muted-foreground"
                      >
                        {format(event.actualFarrowDate, "d/M/y")}{" "}
                        <span className="text-muted-foreground text-sm">
                          {event.actualFarrowDate < event.expectedDate
                            ? `(ก่อนกำหนด ${Math.ceil(
                                (event.expectedDate.getTime() -
                                  event.actualFarrowDate.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )} วัน)`
                            : `(หลังกำหนด ${Math.ceil(
                                (event.actualFarrowDate.getTime() -
                                  event.expectedDate.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )} วัน)`}
                        </span>
                      </InfoIcon>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end items-center gap-2">
                    <Link href={`/sows/${event.sowId}`}>
                      <Button variant={"ghost"}>ดูรายละเอียด</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-16">
              ไม่มีแม่พันธุ์ที่คาดว่าจะคลอดในวันที่นี้
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
