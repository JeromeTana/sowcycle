import React from "react";
import { PiggyBank, CalendarIcon, Check, ChevronRight } from "lucide-react";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  pigletCount: number;
  maleCount: number;
  femaleCount: number;
}

interface SaleableEventListProps {
  events: SaleableEvent[];
}

export const SaleableEventList: React.FC<SaleableEventListProps> = ({
  events,
}) => {
  if (events.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {events.map((event, index) => (
        <FadeIn key={event.id} delay={index * 0.1}>
          <Card className="overflow-hidden border-none">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-lime-500">
                    ขาย ลูกขุนแม่{event.sowName}
                  </h3>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>

              {/* Piglet Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 text-gray-500 bg-gray-100 rounded-2xl">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">จำนวน</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {event.pigletCount} ตัว
                    </span>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                        ผู้ {event.maleCount}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                        เมีย {event.femaleCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {/* Record Sale Button */}

                <Button
                  size={"lg"}
                  className="w-full h-12 text-base shadow-none bg-lime-500 hover:bg-lime-600"
                >
                  <Check className="w-5 h-5 mr-2" /> บันทึกวันขาย
                </Button>
                <AddToCalendarButton
                  title={`ลูกขุนพร้อมขาย แม่${event.sowName}`}
                  description={`แม่พันธุ์: ${event.sowName}\nจำนวน: ${event.pigletCount} ตัว`}
                  startDate={event.saleableDate}
                  className="w-full h-12 text-base font-medium"
                />
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      ))}
    </div>
  );
};
