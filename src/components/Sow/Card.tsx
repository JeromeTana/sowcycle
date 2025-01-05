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
  CalendarCheck,
  CalendarHeart,
  Check,
  Clock,
  Heart,
  PiggyBank,
  PiggyBankIcon,
  Plus,
} from "lucide-react";

import { FarrowForm, NewBreedingForm } from "../Breeding/Form";
import DialogComponent from "../DialogComponent";

export default function SowCard({ sow }: { sow: Sow }) {
  const [latestBreedings, setLatestBreedings] = useState<Breeding>(
    {} as Breeding
  );

  useEffect(() => {
    let fetchBreedings = async () => {
      const breedings = await getBreedingsBySowId(sow.id);
      if (breedings) {
        setLatestBreedings(breedings[0]);
      }
    };
    fetchBreedings();
    return () => {};
  }, []);
  return (
    <Card className="w-full">
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
          <div>
            <p className="inline-flex gap-1 items-center">
              {sow.is_available ? <Heart size={16} /> : <PiggyBank size={16} />}
              สถานะ: {sow.is_available ? "พร้อมผสม" : "ตั้งครรภ์"}
            </p>
          </div>
          {latestBreedings?.actual_farrow_date === null && (
            <div className="border p-4 rounded-lg mt-2 bg-slate-50">
              <div>
                <p className="inline-flex gap-1 items-center">
                  <Clock size={16} />
                  คลอดภายใน{" "}
                  {Math.ceil(
                    (new Date(latestBreedings.expected_farrow_date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  วัน
                </p>
              </div>
              <div className="mt-2">
                <div>
                  <p className="inline-flex gap-1 items-center">
                    <CalendarHeart size={16} />
                    ผสมวันที่:{" "}
                    {new Date(latestBreedings.breed_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                </div>
                <div>
                  <p className="inline-flex gap-1 items-center">
                    <CalendarCheck size={16} />
                    กำหนดคลอด:{" "}
                    {new Date(
                      latestBreedings.expected_farrow_date
                    ).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            </div>
          )}
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
                <Button variant={"secondary"}>
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
