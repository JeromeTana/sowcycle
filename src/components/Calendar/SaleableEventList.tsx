import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Banknote, CalendarIcon, PiggyBank, Dna } from "lucide-react";
import InfoIcon from "@/components/InfoIcon";

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

interface SaleableEventListProps {
  events: SaleableEvent[];
}

export const SaleableEventList: React.FC<SaleableEventListProps> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <>
      <p className="pt-6 pb-4 font-bold text-lg">
        ลูกสุกรพร้อมขาย {`(${events.length})`}
      </p>
      <div className="space-y-3">
        {events.map((event) => (
          <Link
            href={`/litters/${event.litterId}`}
            key={event.id}
            className="p-6 rounded-xl bg-white block shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2">
              <Banknote className="text-green-600" />
              <span className="font-bold">{event.sowName}</span>
            </div>
            <div className="flex flex-col mt-6 gap-6">
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
  );
};