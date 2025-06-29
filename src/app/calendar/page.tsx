"use client";

import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Heart, Clock, AlertTriangle } from "lucide-react";
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
      <div className="flex items-center gap-2">
        <CalendarDays className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Farrow Calendar</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              setSelectedDate(date);
            }}
            defaultMonth={new Date()}
            className="rounded-xl bg-white"
            modifiers={{
              eventDay: (date) =>
                farrowEvents.some((event) =>
                  isSameDay(event.expectedDate, date)
                ),
              overdueDay: (date) =>
                farrowEvents.some(
                  (event) =>
                    isSameDay(event.expectedDate, date) && event.isOverdue
                ),
              upcomingDay: (date) =>
                farrowEvents.some(
                  (event) =>
                    isSameDay(event.expectedDate, date) &&
                    event.daysUntilFarrow >= 0 &&
                    event.daysUntilFarrow <= 7
                ),
            }}
            modifiersStyles={{
              eventDay: {
                backgroundColor: "#ec4899",
                color: "#fff",
              },
              overdueDay: {
                backgroundColor: "#ec4899",
                color: "#fff",
              },
              upcomingDay: {
                backgroundColor: "#ec4899",
                color: "#fff",
              },
            }}
          />
          {format(selectedDate!, "MMMM d, yyyy")}

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{event.sowName}</span>
                    {event.isOverdue && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Overdue
                      </span>
                    )}
                    {event.daysUntilFarrow === 0 && !event.isOverdue && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bred: {format(event.breedDate, "MMM d, yyyy")}
                  </p>
                  {event.actualFarrowDate && (
                    <div className="flex items-center gap-1 mt-2">
                      <Heart className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        Farrowed:{" "}
                        {format(event.actualFarrowDate, "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No farrow events on this date
            </p>
          )}
        </div>

        {/* <div className="space-y-6">
          {overdueEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Overdue Farrows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border border-red-200 rounded-lg bg-red-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.sowName}</span>
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          {Math.abs(event.daysUntilFarrow)} days overdue
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expected: {format(event.expectedDate, "MMM d, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Farrows
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.sowName}</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            event.daysUntilFarrow === 0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.daysUntilFarrow === 0
                            ? "Today"
                            : `${event.daysUntilFarrow} days`}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(event.expectedDate, "MMM d, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming farrows in the next 7 days
                </p>
              )}
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
