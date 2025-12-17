import React from "react";
import {
  PiggyBank,
  CalendarIcon,
  Dna,
  Check,
  Milk,
  ChevronRight,
} from "lucide-react";
import InfoIcon from "@/components/InfoIcon";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SowTags } from "../Sow/SowTags";

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
}

interface FarrowEventListProps {
  events: FarrowEvent[];
}

export const FarrowEventList: React.FC<FarrowEventListProps> = ({ events }) => {
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
                  <h3 className="text-lg font-bold text-pink-500">
                    คลอด {event.sowName}
                  </h3>
                  {/* Tags */}
                  {event.sowBreasts && (
                    <div className="flex flex-wrap gap-2">
                      <SowTags
                        // breedIds={sow.breed_ids}
                        breastsCount={event.sowBreasts}
                        className="bg-secondary px-4 py-1.5 text-sm"
                      />
                    </div>
                  )}
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>

              {/* Boar Info */}
              {event.boarBreed && (
                <div className="flex items-center justify-between p-4 mb-6 bg-secondary rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl">
                      <Dna size={24} className="text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        พ่อพันธุ์
                      </span>
                      <span className="font-semibold text-gray-900">
                        {event.boarBreed}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 " />
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                {/* Record Farrowing Button - This would ideally open a form */}
                <Button className="w-full h-12 text-base font-medium bg-pink-500 hover:bg-pink-600">
                  <Check className="w-5 h-5 mr-2" /> บันทึกการคลอด
                </Button>

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
