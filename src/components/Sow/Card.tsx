"use client";

import { Sow } from "@/types/sow";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  Calendar,
  CalendarCheck,
  CalendarHeart,
  Check,
  Heart,
  PiggyBank,
  Plus,
} from "lucide-react";

import { FarrowForm, NewBreedingForm } from "../Breeding/Form";
import DialogComponent from "../DialogComponent";
import { cn } from "@/lib/utils";
import CountdownBadge from "../CountdownBadge";
import InfoIcon from "../InfoIcon";

export default function SowCard({ sow }: { sow: Sow }) {
  const latestBreeding = sow.breedings?.[0];

  return (
    <Card className={cn(sow.is_active ? "" : "opacity-60", "w-full")}>
      <CardHeader>
        <CardTitle>{sow.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {sow.is_active ? (
            <div>
              {sow.is_available ? (
                <>
                  <p className="text-emerald-600 inline-flex items-center gap-1">
                    <PiggyBank size={22} />
                    พร้อมผสม
                  </p>
                  <div className="flex flex-col gap-2 mt-6">
                    {latestBreeding?.actual_farrow_date ? (
                      <InfoIcon
                        label="คลอดล่าสุด"
                        icon={<Calendar size={22} />}
                      >
                        {new Date(
                          latestBreeding?.actual_farrow_date
                        ).toLocaleDateString("en-GB")}{" "}
                        <span className="text-gray-400">
                          (
                          {Math.floor(
                            (new Date().getTime() -
                              new Date(
                                latestBreeding?.actual_farrow_date
                              ).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          วันที่แล้ว)
                        </span>
                      </InfoIcon>
                    ) : (
                      <span className="text-gray-400">
                        {" "}
                        ไม่มีประวัติการคลอด
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-pink-500 inline-flex items-center gap-1">
                    <Heart size={22} />
                    ตั้งครรภ์
                  </p>
                  <CountdownBadge date={latestBreeding.expected_farrow_date} />
                </div>
              )}
            </div>
          ) : (
            <>ไม่อยู่</>
          )}
          {latestBreeding?.breed_date &&
            !latestBreeding?.actual_farrow_date && (
              <div className="flex flex-col gap-2 mt-6">
                <InfoIcon label="ผสมเมื่อ" icon={<CalendarHeart size={22} />}>
                  {new Date(latestBreeding.breed_date).toLocaleDateString(
                    "en-GB"
                  )}
                </InfoIcon>
                <InfoIcon label="กำหนดคลอด" icon={<CalendarCheck size={22} />}>
                  {new Date(
                    latestBreeding.expected_farrow_date!
                  ).toLocaleDateString("en-GB")}
                </InfoIcon>
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/sows/${sow.id}`}>
            <Button variant={"ghost"}>ดูรายละเอียด</Button>
          </Link>
          {latestBreeding?.actual_farrow_date === null ? (
            <DialogComponent
              title="บันทึกการคลอด"
              dialogTriggerButton={
                <Button>
                  <Check /> บันทึกการคลอด
                </Button>
              }
            >
              <FarrowForm breeding={latestBreeding} />
            </DialogComponent>
          ) : (
            <DialogComponent
              title="บันทึกการคลอด"
              dialogTriggerButton={
                <Button disabled={!sow.is_active} variant={"secondary"}>
                  <Plus /> เพิ่มประวัติผสม
                </Button>
              }
            >
              <NewBreedingForm id={sow.id.toString()} />
            </DialogComponent>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
