"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Litter } from "@/types/litter";
import DrawerDialog from "../DrawerDialog";
import { Button } from "../ui/button";
import {
  PiggyBank,
  ChevronRight,
  Calendar,
  Beef,
  Banknote,
  Gauge,
  Plus,
  Check,
  Cake,
} from "lucide-react";
import { LitterForm } from "./Form";
import LitterDrawer from "./Drawer";
import { cn } from "@/lib/utils";
import { AddToCalendarButton } from "../AddToCalendarButton";
import { Sow } from "@/types/sow";
import { useMemo } from "react";

interface ExtendedLitter extends Litter {
  sows: Sow | undefined;
}

interface LitterCardProps {
  litter: ExtendedLitter;
  index: number;
}

export default function LitterCard({ litter, index }: LitterCardProps) {
  const ageInDays = useMemo(() => {
    const endDate = litter.sold_at ? new Date(litter.sold_at) : new Date();
    const birthDate = new Date(litter.birth_date!);
    return Math.floor(
      (endDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [litter.birth_date, litter.sold_at]);

  if (!litter) return null;

  const isSold = !!litter.sold_at;
  const isFattening = !!litter.fattening_at && !isSold;
  const isBorn = !litter.fattening_at; // Just born, not fattening yet

  const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DrawerDialog
      title={`ลูกขุนแม่${litter.sows?.name || "ไม่ระบุ"}`}
      dialogTriggerButton={
        <Card className="w-full overflow-hidden text-left transition-all bg-white border-none shadow-none cursor-pointer rounded-2xl md:hover:bg-gray-50">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex justify-between mb-4">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900">
                  ลูกขุนแม่{litter.sows?.name || "ไม่ระบุ"}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  {isSold && <span className="text-green-600">ขายแล้ว</span>}
                  {isFattening && (
                    <span className="text-orange-500">กำลังขุน</span>
                  )}
                  <span className="text-muted-foreground">
                    อายุ {ageInDays} วัน
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>

            <div className="space-y-4">
              {/* Count Stats */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 p-2 bg-gray-100 rounded-2xl text-muted-foreground">
                  <PiggyBank size={24} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-muted-foreground text-sm mb-0.5">จำนวน</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {litter.piglets_born_count} ตัว
                    </span>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                        ผู้ {litter.piglets_male_born_alive}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                        เมีย {litter.piglets_female_born_alive}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight Stats (Only if Sold) */}
              {isSold && litter.avg_weight && (
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 p-2 bg-gray-100 rounded-2xl text-muted-foreground">
                    <Gauge size={24} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-muted-foreground text-sm mb-0.5">
                      น้ำหนักขายเฉลี่ย
                    </p>
                    <span className="font-semibold text-gray-900">
                      {litter.avg_weight} kg
                    </span>
                  </div>
                </div>
              )}

              {/* Timeline Section */}
              <div className="relative flex flex-col gap-4 p-4 bg-accent rounded-xl">
                {/* Vertical Line */}
                {(isFattening || isSold) && (
                  <div className="absolute left-10 top-6 bottom-6 w-[2px] bg-gray-200 -z-0" />
                )}

                {/* Timeline: Born */}
                <div className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 p-2 bg-white rounded-2xl text-muted-foreground">
                    <Cake size={24} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-muted-foreground text-sm mb-0.5">
                      คลอดเมื่อ
                    </p>
                    <span className="font-semibold text-gray-900">
                      {formatDateDisplay(litter.birth_date!)}
                    </span>
                  </div>
                </div>

                {/* Timeline: Fattening */}
                {(isFattening || isSold) && (
                  <div className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 p-2 bg-white rounded-2xl text-muted-foreground">
                      <Beef size={24} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-muted-foreground text-sm mb-0.5">
                        เริ่มขุนเมื่อ
                      </p>
                      <span className="font-semibold text-gray-900">
                        {formatDateDisplay(litter.fattening_at!)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Timeline: Sale/Expected Sale */}
                {(isFattening || isSold) && (
                  <div className="relative flex items-start gap-4">
                    <div className={cn("flex items-center justify-center w-12 h-12 p-2  rounded-2xl ",
                      isSold ? "bg-white text-muted-foreground" : "bg-muted text-neutral-300"
                    )}>
                      <Banknote size={24} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-muted-foreground text-sm mb-0.5">
                        {isSold ? "ขายแล้วเมื่อ" : "กำหนดขาย"}
                      </p>
                      <span className="font-semibold text-gray-900">
                        {isSold
                          ? formatDateDisplay(litter.sold_at!)
                          : formatDateDisplay(litter.saleable_at!)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          {/* Footer Actions */}
          {isSold ? null : (
            <CardFooter className="flex flex-col gap-2 pt-0">
              {/* Add Fattening Button */}
              {isBorn && (
                <div onClick={(e) => e.stopPropagation()} className="w-full">
                  <DrawerDialog
                    title="เพิ่มวันเริ่มขุน"
                    dialogTriggerButton={
                      <Button
                        variant="secondary"
                        className="w-full h-12 text-base font-medium"
                      >
                        <Plus className="w-5 h-5 mr-2" /> เพิ่มวันเริ่มขุน
                      </Button>
                    }
                  >
                    <LitterForm litter={litter} />
                  </DrawerDialog>
                </div>
              )}

              {/* Record Sale Button */}
              {isFattening && (
                <div onClick={(e) => e.stopPropagation()} className="w-full">
                  <DrawerDialog
                    title="บันทึกวันขาย"
                    dialogTriggerButton={
                      <Button className="w-full h-12 text-base font-medium text-white bg-lime-500 rounded-full shadow-none hover:bg-[#65a30d]">
                        <Check className="w-5 h-5 mr-2" /> บันทึกวันขาย
                      </Button>
                    }
                  >
                    <LitterForm litter={litter} />
                  </DrawerDialog>
                </div>
              )}

              {/* Add to Calendar */}
              {isFattening && litter.saleable_at && (
                <div onClick={(e) => e.stopPropagation()} className="w-full">
                  <AddToCalendarButton
                    title={`กำหนดจับหมูขุน แม่${litter.sows?.name}`}
                    startDate={new Date(litter.saleable_at)}
                    className="w-full h-12 text-base font-medium"
                  />
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      }
    >
      <LitterDrawer litter={litter} index={index} />
    </DrawerDialog>
  );
}
