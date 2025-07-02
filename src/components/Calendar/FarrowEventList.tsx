import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PiggyBank, CalendarIcon } from "lucide-react";
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

interface FarrowEventListProps {
  events: FarrowEvent[];
}

export const FarrowEventList: React.FC<FarrowEventListProps> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <>
      <p className="pt-6 pb-4 font-bold text-lg">
        กำหนดคลอด {`(${events.length})`}
      </p>
      <div className="space-y-3">
        {events.map((event) => (
          <Link
            href={`/sows/${event.sowId}`}
            key={event.id}
            className="p-6 rounded-xl bg-white block hover:shadow-md transition-shadow"
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
  );
};