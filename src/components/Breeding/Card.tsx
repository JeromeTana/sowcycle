import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Breeding } from "@/types/breeding";
import DialogComponent from "../DialogComponent";
import { Button } from "../ui/button";
import {
  Check,
  Pen,
  X,
  Calendar,
  CalendarHeart,
  CalendarCheck,
  PiggyBank,
  Clock,
  Heart,
} from "lucide-react";
import { FarrowForm, NewBreedingForm } from "./Form";

export default function BreedingCard({
  breeding,
  index,
}: {
  breeding: Breeding;
  index: number;
}) {
  if (!breeding) return null;
  return (
    <Card
      className={
        breeding.actual_farrow_date ? "" : "bg-pink-100 border-pink-300"
      }
    >
      <CardHeader>
        <p className="text-lg font-bold inline-flex items-center gap-1">
          <Heart size={20} />
          ผสมครั้งที่ {index}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {!breeding.actual_farrow_date && (
              <p className="inline-flex gap-1 items-center bg-pink-500 text-white py-2 px-4 rounded-full">
                <Clock size={16} />
                คลอดในอีก{" "}
                {Math.ceil(
                  (new Date(breeding.expected_farrow_date).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                วัน
              </p>
            )}
            <div className="flex flex-col gap-1">
              <p className="inline-flex items-center gap-1">
                <div className="border p-2 bg-gray-50 rounded-lg">
                  <CalendarHeart size={16} className="text-gray-500" />
                </div>
                ผสมเมื่อ{" "}
                {new Date(breeding.breed_date).toLocaleDateString("en-GB")}
              </p>
              {breeding.actual_farrow_date ? (
                <p className="inline-flex items-center gap-1">
                  <span className="border p-2 bg-gray-50 rounded-lg">
                    <Calendar size={16} className="text-gray-500" />
                  </span>
                  คลอดเมื่อ{" "}
                  {new Date(breeding.actual_farrow_date).toLocaleDateString(
                    "en-GB"
                  )}{" "}
                  <span className="text-gray-400">
                    (
                    {new Date(breeding.actual_farrow_date) <
                    new Date(breeding.expected_farrow_date) ? (
                      <>
                        ก่อนกำหนด{" "}
                        {Math.ceil(
                          (new Date(breeding.expected_farrow_date).getTime() -
                            new Date(breeding.actual_farrow_date).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        วัน
                      </>
                    ) : (
                      <>
                        หลังกำหนด{" "}
                        {Math.ceil(
                          (new Date(breeding.actual_farrow_date).getTime() -
                            new Date(breeding.expected_farrow_date).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        วัน
                      </>
                    )}
                    )
                  </span>
                </p>
              ) : (
                <p className="inline-flex items-center gap-1">
                  <div className="border p-2 bg-gray-50 rounded-lg">
                    <CalendarCheck size={16} className="text-gray-500" />
                  </div>
                  กำหนดคลอด{" "}
                  {new Date(breeding.expected_farrow_date).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
              )}
            </div>
          </div>
          {breeding.actual_farrow_date && (
            <div className="space-y-4 border p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="inline-flex items-center gap-1">
                  <PiggyBank size={16} /> จำนวนลูกหมูเกิดรอด{" "}
                  <span className="font-semibold">
                    {breeding.piglets_born_count}
                  </span>
                  ตัว
                </p>
                <div className="flex gap-1 mt-2">
                  <p className="text-blue-500 border border-blue-300 p-2 bg-blue-50 rounded">
                    ตัวผู้ {breeding.piglets_male_born_alive} ตัว
                  </p>
                  <p className="text-pink-500 border border-pink-300 p-2 bg-pink-50 rounded">
                    ตัวเมีย {breeding.piglets_female_born_alive} ตัว
                  </p>
                </div>
              </div>
              <p className="inline-flex items-center gap-1">
                <X size={16} />
                จำนวนลูกหมูไม่รอด
                <span className="font-semibold">
                  {breeding.piglets_born_dead}
                </span>
                ตัว
              </p>
              <p className="border p-4 bg-gray-100 rounded">
                รวมทั้งหมด{" "}
                <span className="font-semibold">
                  {breeding.piglets_born_count}
                </span>{" "}
                ตัว
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end gap-2">
          <DialogComponent
            title="บันทึกการคลอด"
            dialogTriggerButton={
              <Button variant={"ghost"}>
                <Pen /> แก้ไขประวัติ
              </Button>
            }
          >
            {breeding.actual_farrow_date ? (
              <FarrowForm breeding={breeding} />
            ) : (
              <NewBreedingForm breeding={breeding} />
            )}
          </DialogComponent>
          {breeding.actual_farrow_date === null && (
            <DialogComponent
              title="บันทึกการคลอด"
              dialogTriggerButton={
                <Button>
                  <Check /> บันทึกการคลอด
                </Button>
              }
            >
              <FarrowForm breeding={breeding} />
            </DialogComponent>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
