"use client";

import { getBreedingsBySowId } from "@/services/breeding";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Skeleton } from "../ui/skeleton";

export default function SowCard({ sow }: { sow: Sow }) {
  const [latestBreedings, setLatestBreedings] = useState<Breeding>(
    {} as Breeding
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let fetchBreedings = async () => {
      const breedings = await getBreedingsBySowId(sow.id);
      if (breedings) {
        setLatestBreedings(breedings[0]);
      }
      setIsLoading(false);
    };
    fetchBreedings();

    return () => {};
  }, []);

  return (
    <Card className={cn(sow.is_active ? "" : "opacity-60", "w-full")}>
      <CardHeader>
        <CardTitle>{sow.name}</CardTitle>
        <CardDescription>
          {sow.birthdate
            ? new Date(sow.birthdate).toLocaleDateString("en-GB")
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {sow.is_active ? (
            <div>
              {sow.is_available ? (
                <>
                  <p className="text-emerald-600 inline-flex items-center gap-1">
                    <PiggyBank size={16} />
                    พร้อมผสม
                  </p>
                  {latestBreedings?.actual_farrow_date && (
                    <div className="flex flex-col gap-2 mt-6">
                      <p className="inline-flex items-center gap-1">
                        <span className="border p-2 bg-gray-50 rounded-lg">
                          <Calendar size={16} className="text-gray-500" />
                        </span>
                        คลอดล่าสุด{" "}
                        {new Date(
                          latestBreedings?.actual_farrow_date
                        ).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-pink-500 inline-flex items-center gap-1">
                    <Heart size={16} />
                    ตั้งครรภ์
                  </p>
                  {isLoading ? (
                    <Skeleton className="w-28 h-7 rounded-full" />
                  ) : (
                    <p className="text-sm inline-flex gap-1 items-center bg-pink-500 text-white py-1 px-2 rounded-full">
                      คลอดใน{" "}
                      {Math.ceil(
                        (new Date(
                          latestBreedings.expected_farrow_date
                        ).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      วัน
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>ไม่อยู่</>
          )}
          {!sow.is_available &&
            (isLoading ? (
              <Skeleton className="w-full h-32 mt-2" />
            ) : (
              <div className="flex flex-col gap-2 mt-6">
                <p className="inline-flex items-center gap-1">
                  <span className="border p-2 bg-gray-50 rounded-lg">
                    <CalendarHeart size={16} className="text-gray-500" />
                  </span>
                  ผสมเมื่อ{" "}
                  {new Date(latestBreedings.breed_date).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
                <p className="inline-flex items-center gap-1">
                  <span className="border p-2 bg-gray-50 rounded-lg">
                    <CalendarCheck size={16} className="text-gray-500" />
                  </span>
                  กำหนดคลอด{" "}
                  {new Date(
                    latestBreedings.expected_farrow_date
                  ).toLocaleDateString("en-GB")}
                </p>
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/sows/${sow.id}`}>
            <Button variant={"ghost"}>ดูรายละเอียด</Button>
          </Link>
          {latestBreedings?.actual_farrow_date === null ? (
            <DialogComponent
              title="บันทึกการคลอด"
              dialogTriggerButton={
                <Button>
                  <Check /> บันทึกการคลอด
                </Button>
              }
            >
              <FarrowForm breeding={latestBreedings} />
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
