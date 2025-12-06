import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PiggyBank, CalendarIcon } from "lucide-react";
import InfoIcon from "@/components/InfoIcon";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import { FadeIn } from "@/components/animations/FadeIn";

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

interface FarrowEventListProps {
  events: FarrowEvent[];
}

export const FarrowEventList: React.FC<FarrowEventListProps> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, index) => (
          <FadeIn key={event.id} delay={index * 0.1}>
            <Link
              href={`/sows/${event.sowId}`}
              className="p-6 rounded-xl bg-white block transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <PiggyBank />
                  <span className="font-bold">{event.sowName}</span>
                </div>
                {!event.actualFarrowDate && (
                  <AddToCalendarButton
                    title={`กำหนดคลอด ${event.sowName}`}
                    description={`แม่พันธุ์: ${event.sowName}\nวันที่ผสม: ${format(
                      event.breedDate,
                      "dd/MM/yyyy",
                    )}`}
                    startDate={event.expectedDate}
                  />
                )}
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
                        ? `(ก่อนกำหนด ${Math.floor(
                            (event.expectedDate.getTime() -
                              event.actualFarrowDate.getTime()) /
                              (1000 * 60 * 60 * 24),
                          )} วัน)`
                        : `(หลังกำหนด ${Math.floor(
                            (event.actualFarrowDate.getTime() -
                              event.expectedDate.getTime()) /
                              (1000 * 60 * 60 * 24),
                          )} วัน)`}
                    </span>
                  </InfoIcon>
                </div>
              )}
            </Link>
          </FadeIn>
        ))}
      </div>
    </>
  );
};
