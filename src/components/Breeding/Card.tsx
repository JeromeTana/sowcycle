"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Breeding } from "@/types/breeding";
import DialogComponent from "../DrawerDialog";
import { Button } from "../ui/button";
import {
  Check,
  ChevronRight,
  Calendar,
  PiggyBank,
  Heart,
  Dna,
} from "lucide-react";
import { FarrowForm } from "./Form";
import { cn } from "@/lib/utils";
import BoarDetailsCard from "../Boar/DetailsCard";
import { AddToCalendarButton } from "../AddToCalendarButton";
import BreedingDrawer from "./Drawer";

export default function BreedingCard({
  breeding,
  index,
}: {
  breeding: Breeding;
  index: number;
}) {
  if (!breeding) return null;

  const isPregnant = !breeding.actual_farrow_date && !breeding.is_aborted;
  const isCompleted = !!breeding.actual_farrow_date;

  const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysDiffFromExpected = (actual: string, expected: string) => {
    const diffTime = new Date(expected).getTime() - new Date(actual).getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (days > 0) return `ก่อนกำหนด ${days} วัน`;
    if (days < 0) return `หลังกำหนด ${Math.abs(days)} วัน`;
    return "ตรงตามกำหนด";
  };

  return (
    <DialogComponent
      title={`ผสมครั้งที่ ${index}`}
      dialogTriggerButton={
        <Card className="w-full overflow-hidden text-left transition-all bg-white border-none shadow-none cursor-pointer rounded-2xl md:hover:bg-gray-50">
          <CardContent className="p-4 pb-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={cn(
                    "text-xl font-semibold",
                    isPregnant ? "text-pink-500" : "text-black"
                  )}
                >
                  ผสมครั้งที่ {index}
                </h3>
                {isPregnant && (
                  <span className="text-sm font-normal text-pink-400">
                    (คลอดภายใน {getDaysRemaining(breeding.expected_farrow_date)}{" "}
                    วัน)
                  </span>
                )}
                {breeding.is_aborted && (
                  <span className="text-red-500">(แท้ง)</span>
                )}
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>

            <div className="space-y-4">
              {/* Breeding Date */}
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 p-2  bg-gray-100 rounded-2xl",
                    isPregnant ? "text-pink-500" : "text-muted-foreground"
                  )}
                >
                  <Heart size={24} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-muted-foreground text-sm mb-0.5">ผสมเมื่อ</p>
                  <span className="font-semibold text-gray-900">
                    {formatDateDisplay(breeding.breed_date)}
                  </span>
                </div>
              </div>

              {/* Farrow Date / Expected Date */}
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "p-2 rounded-2xl flex items-center justify-center w-12 h-12 bg-gray-100",
                    isPregnant ? "text-pink-500" : "text-muted-foreground"
                  )}
                >
                  <Calendar size={24} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-muted-foreground text-sm mb-0.5">
                    {isCompleted ? "คลอดเมื่อ" : "กำหนดคลอด"}
                  </p>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold text-gray-900">
                      {isCompleted
                        ? formatDateDisplay(breeding.actual_farrow_date!)
                        : formatDateDisplay(breeding.expected_farrow_date)}
                    </span>
                    {isCompleted && (
                      <span className="text-sm text-muted-foreground">
                        {getDaysDiffFromExpected(
                          breeding.actual_farrow_date!,
                          breeding.expected_farrow_date
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Boar Info */}
              {breeding.boars && (
                <div onClick={(e) => e.stopPropagation()} className="w-full">
                  <DialogComponent
                    title={breeding.boars.breed}
                    dialogTriggerButton={
                      <div className="flex items-center justify-between w-full p-3 cursor-pointer bg-secondary rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 p-2 bg-white text-muted-foreground rounded-2xl">
                            <Dna />
                          </div>
                          <div className="flex flex-col text-left">
                            <p className="text-xs text-muted-foreground">
                              พ่อพันธุ์
                            </p>
                            <span className="font-semibold text-gray-900">
                              {breeding.boars.breed}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-muted-foreground"
                        />
                      </div>
                    }
                  >
                    <BoarDetailsCard boar={breeding.boars} />
                  </DialogComponent>
                </div>
              )}

              {/* Piglets Info (Only if completed) */}
              {isCompleted && (
                <div className="flex items-start gap-4 p-4 !mb-2 bg-secondary rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 p-2 bg-white text-muted-foreground rounded-2xl">
                    <PiggyBank size={24} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-muted-foreground text-sm mb-0.5">จำนวนลูกเกิดรอด</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {breeding.piglets_born_count} ตัว
                      </span>
                      <div className="flex gap-1 ml-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          ผู้ {breeding.piglets_male_born_alive}
                        </span>
                        <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                          เมีย {breeding.piglets_female_born_alive}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {isPregnant && (
            <CardFooter className="flex flex-col gap-2 p-4 pt-2">
              <div onClick={(e) => e.stopPropagation()} className="w-full">
                <DialogComponent
                  title="บันทึกการคลอด"
                  dialogTriggerButton={
                    <Button
                      size="lg"
                      className="w-full h-12 text-base font-medium text-white bg-pink-500 rounded-full shadow-none md:hover:bg-pink-600"
                    >
                      <Check className="w-5 h-5 mr-2" /> บันทึกการคลอด
                    </Button>
                  }
                >
                  <FarrowForm breeding={breeding} />
                </DialogComponent>
              </div>

              <div className="w-full" onClick={(e) => e.stopPropagation()}>
                <AddToCalendarButton
                  title={`กำหนดคลอด`}
                  startDate={new Date(breeding.expected_farrow_date)}
                  className="w-full h-12 text-base font-medium text-gray-900 bg-gray-100 border-none rounded-full shadow-none md:hover:bg-gray-200"
                />
              </div>
            </CardFooter>
          )}
        </Card>
      }
    >
      <BreedingDrawer breeding={breeding} index={index} />
    </DialogComponent>
  );
}
