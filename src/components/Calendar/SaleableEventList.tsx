import React from "react";
import {
  PiggyBank,
  CalendarIcon,
  Check,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InfoIcon from "../InfoIcon";
import { formatDateTH, getDaysRemaining } from "@/lib/utils";
import DrawerDialog from "@/components/DrawerDialog";
import { LitterForm } from "@/components/Litter/Form";
import { Litter } from "@/types/litter";

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
  fattening_at?: Date;
  boarId?: number;
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

              <div className="flex flex-col gap-4 mb-4">
                <InfoIcon label="พร้อมขายเมื่อ" icon={<Calendar size={24} />}>
                  <span className="font-semibold text-gray-900">
                    {formatDateTH(event.saleableDate.toDateString())}
                  </span>{" "}
                  <span className="text-sm font-medium text-lime-500">
                    ภายใน {getDaysRemaining(event.saleableDate.toDateString())}{" "}
                    วัน
                  </span>
                </InfoIcon>
                {/* Piglet Info */}
                <InfoIcon
                  label="จำนวน"
                  icon={<PiggyBank className="w-6 h-6" />}
                >
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
                </InfoIcon>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {/* Record Sale Button */}

                <DrawerDialog
                  title="บันทึกวันขาย"
                  dialogTriggerButton={
                    <Button
                      size={"lg"}
                      className="w-full h-12 text-base shadow-none bg-lime-500 hover:bg-lime-600"
                    >
                      <Check className="w-5 h-5 mr-2" /> บันทึกวันขาย
                    </Button>
                  }
                >
                  <LitterForm
                    litter={{
                      id: event.litterId,
                      sow_id: event.sowId,
                      birth_date: event.farrowDate.toISOString(),
                      piglets_born_count: event.pigletCount,
                      piglets_male_born_alive: event.maleCount,
                      piglets_female_born_alive: event.femaleCount,
                      saleable_at: event.saleableDate.toISOString(),
                      fattening_at: event.fattening_at?.toISOString(),
                      boar_id: event.boarId,
                      boars: event.boarId
                        ? ({
                            id: event.boarId,
                            breed: event.boarBreed,
                            boar_id: event.boarId,
                          } as any)
                        : undefined,
                    }}
                  />
                </DrawerDialog>
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
