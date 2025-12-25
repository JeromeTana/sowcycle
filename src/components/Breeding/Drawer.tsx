"use client";

import { Breeding } from "@/types/breeding";
import { Button } from "../ui/button";
import {
  Check,
  Calendar,
  PiggyBank,
  Heart,
  Dna,
  X,
  Pencil,
  ChevronRight,
} from "lucide-react";
import { cn, formatDateTH } from "@/lib/utils";
import DialogComponent from "../DrawerDialog";
import { FarrowForm } from "./Form";
import { AddToCalendarButton } from "../AddToCalendarButton";
import BoarDetailsCard from "../Boar/DetailsCard";
import { NewBreedingForm } from "./NewBreedingForm";

export default function BreedingDrawer({
  breeding,
  index,
}: {
  breeding: Breeding;
  index: number;
}) {
  const isPregnant = !breeding.actual_farrow_date && !breeding.is_aborted;
  const isCompleted = !!breeding.actual_farrow_date;

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
    <div className="space-y-4">
      {/* Header Title */}
      {/* <div className="flex flex-wrap items-center gap-2">
        <h3
          className={cn(
            "text-xl font-bold",
            isPregnant ? "text-primary" : "text-black"
          )}
        >
          ผสมครั้งที่ {index}
        </h3>
        {isPregnant && (
          <span className="text-sm font-normal text-pink-400">
            (คลอดภายใน {getDaysRemaining(breeding.expected_farrow_date)} วัน)
          </span>
        )}
        {breeding.is_aborted && <span className="text-red-500">(แท้ง)</span>}
      </div> */}

      {/* List Items */}
      <div className="space-y-4">
        {/* Breed Date */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 p-2 bg-gray-100 rounded-2xl",
              isPregnant ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Heart size={24} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-muted-foreground text-sm mb-0.5">ผสมเมื่อ</p>
            <span className="font-semibold text-gray-900">
              {formatDateTH(breeding.breed_date)}
            </span>
          </div>
        </div>

        {/* Farrow Date / Expected Date */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-2 rounded-2xl flex items-center justify-center w-12 h-12 bg-gray-100",
              isPregnant ? "text-primary" : "text-muted-foreground"
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
                  ? formatDateTH(breeding.actual_farrow_date!)
                  : formatDateTH(breeding.expected_farrow_date)}
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
          <DialogComponent
            title={breeding.boars.breed}
            dialogTriggerButton={
              <div className="flex items-center justify-between w-full p-3 cursor-pointer bg-secondary rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 p-2 bg-white text-muted-foreground rounded-2xl">
                    <Dna />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-xs text-muted-foreground">พ่อพันธุ์</p>
                    <span className="font-semibold text-gray-900">
                      {breeding.boars.breed}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            }
          >
            <BoarDetailsCard boar={breeding.boars} />
          </DialogComponent>
        )}

        {/* Piglets Info (Only if completed) */}
        {isCompleted && (
          <div className="p-4 space-y-8 bg-muted rounded-xl">
            {/* Born Alive */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 p-2 bg-white text-muted-foreground rounded-2xl">
                <PiggyBank size={24} />
              </div>
              <div className="flex flex-col justify-center w-full">
                <p className="text-muted-foreground text-sm mb-0.5">
                  จำนวนลูกเกิดรอด
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {breeding.piglets_born_count} ตัว
                  </span>
                  <div className="flex gap-1 ml-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      ผู้ {breeding.piglets_male_born_alive}
                    </span>
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      เมีย {breeding.piglets_female_born_alive}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Born Dead */}
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 p-2 bg-white text-muted-foreground rounded-2xl">
                <X size={24} />
              </div>
              <div className="flex flex-col justify-center w-full">
                <p className="text-muted-foreground text-sm mb-0.5">
                  จำนวนลูกเกิดตาย
                </p>
                <span className="text-lg font-semibold text-gray-900">
                  {breeding.piglets_born_dead || 0} ตัว
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-white border rounded-full">
              <span className="font-semibold text-gray-900">รวมทั้งหมด { (breeding.piglets_born_count || 0) + (breeding.piglets_born_dead || 0) } ตัว</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {isPregnant && (
          <>
            <DialogComponent
              title="บันทึกการคลอด"
              dialogTriggerButton={
                <Button
                  size="lg"
                  className="w-full h-12 text-base font-medium text-white bg-primary rounded-full shadow-none hover:bg-pink-600"
                >
                  <Check className="w-5 h-5 mr-2" /> บันทึกการคลอด
                </Button>
              }
            >
              <FarrowForm breeding={breeding} />
            </DialogComponent>

            <AddToCalendarButton
              title={`กำหนดคลอด`}
              startDate={new Date(breeding.expected_farrow_date)}
              className="w-full h-12 text-base font-medium text-gray-900 bg-gray-100 border-none rounded-full shadow-none hover:bg-gray-200"
            />
          </>
        )}

        <DialogComponent
          title="แก้ไขข้อมูล"
          dialogTriggerButton={
            <Button
              variant="secondary"
              className="w-full h-12 text-base font-medium rounded-full"
            >
              <Pencil className="w-4 h-4 mr-2" /> แก้ไข
            </Button>
          }
        >
          <FarrowForm breeding={breeding} />
        </DialogComponent>
      </div>
    </div>
  );
}
