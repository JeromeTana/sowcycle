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
  PiggyBank,
  DollarSign,
  Banknote,
  Dna,
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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DialogComponent from "@/components/DialogComponent";
import { FarrowForm } from "@/components/Breeding/Form";
import InfoIcon from "@/components/InfoIcon";
import { cn } from "@/lib/utils";
import { getAllLitters } from "@/services/litter";

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

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [breedings, setBreedings] = useState<Breeding[]>([]);
  const [farrowEvents, setFarrowEvents] = useState<FarrowEvent[]>([]);
  const [saleableEvents, setSaleableEvents] = useState<SaleableEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreedings = async () => {
    try {
      setLoading(true);
      const breedings = await getAllBreedings();
      const litters = await getAllLitters();
      setBreedings(breedings);

      // Transform breedings into farrow events
      const events: FarrowEvent[] = breedings.map((breeding) => {
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

      // Transform litters into saleable events
      const saleableEvents: SaleableEvent[] = litters
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
            boarBreed: litter.boars?.breed || "Unknown Boar Breed",
          };
        });

      setFarrowEvents(events);
      setSaleableEvents(saleableEvents);
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

  const selectedSaleableEvents = saleableEvents.filter(
    (event) => selectedDate && isSameDay(event.saleableDate, selectedDate)
  );

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <Calendar
            mode="single"
            disabled={loading}
            numberOfMonths={1}
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              setSelectedDate(date);
            }}
            defaultMonth={new Date()}
            className={cn("rounded-xl bg-white", loading && "animate-pulse")}
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
              hasSaleableEvent: (date) =>
                saleableEvents.some((event) =>
                  isSameDay(event.saleableDate, date)
                ),
              saleablePastDue: (date) =>
                saleableEvents.some(
                  (event) =>
                    isSameDay(event.saleableDate, date) && event.isPastDue
                ),
            }}
            modifiersClassNames={{
              hasEvent: "bg-pink-500 text-white",
              overdue: "bg-pink-500 text-white",
              hasSaleableEvent: "bg-green-500 text-white",
              saleablePastDue: "bg-green-500 text-white",
            }}
          />
          {!loading && (
            <div>
              {selectedDateEvents.length > 0 && (
                <>
                  <p className="pt-6 pb-4 font-bold text-lg">
                    กำหนดคลอด {`(${selectedDateEvents.length})`}
                  </p>
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <Link
                        href={`/sows/${event.sowId}`}
                        key={event.id}
                        className="p-6 rounded-xl bg-white block shadow"
                      >
                        <div className="flex items-center gap-2">
                          <PiggyBank />
                          <span className="font-bold">{event.sowName}</span>
                        </div>
                        {event.actualFarrowDate && (
                          <div className="mt-6">
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
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {selectedSaleableEvents.length > 0 && (
                <>
                  <p className="pt-6 pb-4 font-bold text-lg">
                    ลูกสุกรพร้อมขาย {`(${selectedSaleableEvents.length})`}
                  </p>
                  <div className="space-y-3">
                    {selectedSaleableEvents.map((event) => (
                      <Link
                        href={`/litters/${event.litterId}`}
                        key={event.id}
                        className="p-6 rounded-xl bg-white block shadow"
                      >
                        <div className="flex items-center gap-2">
                          <Banknote className="text-green-600" />
                          <span className="font-bold">{event.sowName}</span>
                        </div>
                        <div className="mt-6 space-y-6">
                          <InfoIcon
                            label="วันที่คลอด"
                            icon={<CalendarIcon className="h-5 w-5" />}
                            className="text-muted-foreground"
                          >
                            {format(event.farrowDate, "d/M/y")}
                          </InfoIcon>
                          <InfoIcon
                            label="แม่พันธุ์"
                            icon={<PiggyBank className="h-5 w-5" />}
                            className="text-muted-foreground"
                          >
                            {event.sowName}
                          </InfoIcon>
                          <InfoIcon
                            label="พ่อพันธุ์"
                            icon={<Dna className="h-5 w-5" />}
                            className="text-muted-foreground"
                          >
                            {event.boarBreed}
                          </InfoIcon>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {selectedDateEvents.length === 0 &&
                selectedSaleableEvents.length === 0 && (
                  <p className="text-muted-foreground text-center py-32">
                    ไม่มีรายการในวันที่นี้
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
