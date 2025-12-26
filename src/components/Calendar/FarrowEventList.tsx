import React from "react";
import {
  PiggyBank,
  CalendarIcon,
  Dna,
  Check,
  Milk,
  ChevronRight,
  Calendar,
} from "lucide-react";
import InfoIcon from "@/components/InfoIcon";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SowTags } from "../Sow/SowTags";
import { formatDateTH, getDaysRemaining } from "@/lib/utils";
import DrawerDialog from "@/components/DrawerDialog";
import { FarrowForm } from "@/components/Breeding/Form";
import { Breeding } from "@/types/breeding";

interface FarrowEvent {
  id: number;
  sowId: number;
  sowName: string;
  expectedDate: Date;
  breedDate: Date;
  daysUntilFarrow: number;
  isOverdue: boolean;
  actualFarrowDate?: Date;
  boarBreed?: string;
  sowBreasts?: number;
  boarId?: number | null;
  sowBreedsIds?: number[];
}

interface FarrowEventListProps {
  events: FarrowEvent[];
  onSuccess?: () => void;
}

export const FarrowEventList: React.FC<FarrowEventListProps> = ({
  events,
  onSuccess,
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
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-primary">
                    คลอด {event.sowName}
                  </h3>
                  {/* Tags */}
                  {((event.sowBreedsIds && event.sowBreedsIds.length > 0) ||
                    (event.sowBreasts !== undefined &&
                      event.sowBreasts > 0)) && (
                    <div className="flex flex-wrap gap-2">
                      <SowTags
                        breedIds={event.sowBreedsIds}
                        breastsCount={event.sowBreasts}
                        className="bg-secondary px-4 py-1.5 text-sm"
                      />
                    </div>
                  )}
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>

              <div className="space-y-2  mb-4">
                <InfoIcon label="กำหนดคลอด" icon={<Calendar size={24} />}>
                  <span className="font-semibold text-gray-900">
                    {formatDateTH(event.expectedDate.toDateString())}
                  </span>{" "}
                  <span className="text-sm font-medium text-primary">
                    {getDaysRemaining(event.expectedDate.toDateString()) > 0
                      ? `ภายใน ${getDaysRemaining(
                          event.expectedDate.toDateString()
                        )} 
                    วัน`
                      : `วันนี้`}
                  </span>
                </InfoIcon>
                {/* {event.boarBreed && (
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <InfoIcon
                      label="พ่อพันธุ์"
                      icon={<Dna size={24} />}
                      className="bg-white"
                    >
                      <span className="font-semibold text-gray-900">
                        {event.boarBreed}
                      </span>
                    </InfoIcon>
                    <ChevronRight size={20} className="text-gray-400 " />
                  </div>
                )} */}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {/* Record Farrowing Button - This would ideally open a form */}
                <DrawerDialog
                  title="บันทึกการคลอด"
                  dialogTriggerButton={
                    <Button className="w-full h-12 text-base font-medium bg-primary hover:bg-pink-600">
                      <Check className="w-5 h-5 mr-2" /> บันทึกการคลอด
                    </Button>
                  }
                >
                  <FarrowForm
                    breeding={{
                      id: event.id,
                      sow_id: event.sowId,
                      breed_date: event.breedDate.toISOString(),
                      expected_farrow_date: event.expectedDate.toISOString(),
                      boar_id: event.boarId || null,
                      boars: event.boarId
                        ? ({
                            id: event.boarId,
                            breed: event.boarBreed,
                          } as any)
                        : undefined,
                    }}
                    onSuccess={onSuccess}
                  />
                </DrawerDialog>

                <AddToCalendarButton
                  title={`กำหนดคลอด ${event.sowName}`}
                  description={`แม่พันธุ์: ${event.sowName}\nพ่อพันธุ์: ${
                    event.boarBreed || "ไม่ระบุ"
                  }`}
                  startDate={event.expectedDate}
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
