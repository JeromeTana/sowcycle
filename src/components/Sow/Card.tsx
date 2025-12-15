"use client";

import { Sow } from "@/types/sow";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  Calendar,
  CalendarCheck,
  CalendarHeart,
  Check,
  Dna,
  Heart,
  PiggyBank,
  Plus,
  X,
} from "lucide-react";

import { FarrowForm, NewBreedingForm } from "../Breeding/Form";
import DialogComponent from "../DialogComponent";
import { cn, formatDate } from "@/lib/utils";
import CountdownBadge from "../CountdownBadge";
import InfoIcon from "../InfoIcon";
import BoarDetailsCard from "../Boar/DetailsCard";
import { AddToCalendarButton } from "../AddToCalendarButton";

export default function SowCard({ sow }: { sow: Sow }) {
  const latestBreeding = sow.breedings?.[0];
  const isPregnant = !sow.is_available && sow.is_active;

  return (
    <Card className={cn("w-full transition-all bg-white")}>
      <Link href={`/sows/${sow.id}`}>
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* <div
                  className={cn(
                    "p-2 rounded-full",
                    isPregnant ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
                  )}
                >
                  <PiggyBank size={24} />
                </div> */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {sow.name}
                  </h3>
                  {latestBreeding && (
                    <p className="text-sm text-muted-foreground">
                      ผสมครั้งที่ {sow.breedings.length}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-sm">
                {sow.is_active ? (
                  sow.is_available ? (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                      พร้อมผสม
                    </span>
                  ) : (
                    <CountdownBadge
                      date={latestBreeding?.expected_farrow_date}
                    />
                  )
                ) : (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    ไม่อยู่
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {latestBreeding ? (
              <>
                <div className="relative flex flex-col gap-6">
                  {/* Breed Date */}
                  <InfoIcon
                    label="ผสมเมื่อ"
                    icon={<Heart size={20} />}
                    className={cn(
                      isPregnant
                        ? "!bg-white !text-pink-500 border-pink-200"
                        : "bg-gray-50 text-gray-500"
                    )}
                  >
                    {formatDate(latestBreeding.breed_date)}
                  </InfoIcon>

                  {/* Farrow Date */}
                  {isPregnant ? (
                    <InfoIcon
                      label="กำหนดคลอด"
                      icon={<Calendar size={20} />}
                      className="!bg-white !text-pink-500 border-pink-200"
                    >
                      {formatDate(latestBreeding.expected_farrow_date!)}
                    </InfoIcon>
                  ) : (
                    latestBreeding.actual_farrow_date && (
                      <InfoIcon
                        label="คลอดเมื่อ"
                        icon={<CalendarCheck size={20} />}
                        className="text-gray-500 bg-gray-50"
                      >
                        {formatDate(latestBreeding.actual_farrow_date)}
                        <span className="ml-2 text-xs text-muted-foreground">
                          (
                          {Math.floor(
                            (new Date().getTime() -
                              new Date(
                                latestBreeding.actual_farrow_date
                              ).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          วันที่แล้ว)
                        </span>
                      </InfoIcon>
                    )
                  )}

                  {/* Boar Info */}
                  {latestBreeding.boars && (
                    <div
                      className={cn(
                        "mt-2 p-3 rounded-xl border",
                        isPregnant
                          ? "bg-white border-pink-100"
                          : "bg-gray-50 border-gray-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white border rounded-full">
                            <Dna size={18} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              พ่อพันธุ์
                            </p>
                            <p className="text-sm font-medium">
                              {latestBreeding.boars.breed}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Piglet Stats (Only if farrowed) */}
                  {!isPregnant && latestBreeding.actual_farrow_date && (
                    <div className="p-3 space-y-3 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white border rounded-full">
                          <PiggyBank size={18} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            จำนวนลูกเกิดรอด
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {latestBreeding.piglets_born_count} ตัว
                            </span>
                            <div className="flex gap-1">
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                                ผู้ {latestBreeding.piglets_male_born_alive}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">
                                เมีย {latestBreeding.piglets_female_born_alive}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-8 text-center border border-dashed text-muted-foreground bg-gray-50 rounded-xl">
                <p>ยังไม่มีประวัติการผสม</p>
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex flex-col gap-3 px-6 pt-0 pb-6">
        {isPregnant && latestBreeding && (
          <div className="grid w-full grid-cols-1 gap-2">
            <DialogComponent
              title="บันทึกการคลอด"
              dialogTriggerButton={
                <Button  size="lg" className="w-full text-white bg-pink-500 hover:bg-pink-600">
                  <Check className="w-4 h-4 mr-2" /> บันทึกการคลอด
                </Button>
              }
            >
              <FarrowForm breeding={latestBreeding} />
            </DialogComponent>

            <AddToCalendarButton
              title={`กำหนดคลอด ${sow.name}`}
              startDate={new Date(latestBreeding.expected_farrow_date!)}
              className="w-full"
            />
          </div>
        )}

        {!isPregnant && (
          <div className="flex w-full gap-2">
            <DialogComponent
              title="เพิ่มประวัติผสม"
              dialogTriggerButton={
                <Button
                  disabled={!sow.is_active}
                  size="lg"
                  variant="secondary"
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" /> เพิ่มประวัติ
                </Button>
              }
            >
              <NewBreedingForm id={sow.id.toString()} />
            </DialogComponent>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
