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
  Heart,
} from "lucide-react";
import { FarrowForm, NewBreedingForm } from "./Form";
import { cn } from "@/lib/utils";

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
        breeding.actual_farrow_date
          ? ""
          : "bg-gradient-to-br from-white to-pink-100 border-pink-300"
      }
    >
      <CardHeader>
        <p
          className={cn(
            breeding.actual_farrow_date ? "text-black" : "text-pink-500",
            "font-bold inline-flex items-center gap-1"
          )}
        >
          <Heart
            size={22}
            className={cn(!breeding.actual_farrow_date && "animate-bounce")}
          />
          ผสมครั้งที่ {index}{" "}
          <span className="font-normal">
            {!breeding.actual_farrow_date && (
              <>
                (คลอดใน{" "}
                {Math.ceil(
                  (new Date(breeding.expected_farrow_date).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                วัน)
              </>
            )}
          </span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-start gap-2 text-gray-500">
              <div
                className={cn(
                  breeding.actual_farrow_date
                    ? "bg-gray-50 text-gray-500"
                    : "bg-pink-50 text-pink-400 border-pink-400",
                  "border p-2 rounded-lg"
                )}
              >
                <CalendarHeart size={22} />
              </div>
              <p className="inline-flex flex-col gap-1">
                <span className="text-xs">ผสมเมื่อ</span>
                <span className="text-black">
                  {new Date(breeding.breed_date).toLocaleDateString("en-GB")}
                </span>
              </p>
            </div>
            {breeding.actual_farrow_date ? (
              <div className="inline-flex items-start gap-2 text-gray-500">
                <div className="border p-2 bg-gray-50 rounded-lg">
                  <CalendarCheck size={22} className="text-gray-500" />
                </div>
                <p className="inline-flex flex-col gap-1">
                  <span className="text-xs">คลอดเมื่อ</span>
                  <span className="text-black">
                    {new Date(breeding.actual_farrow_date).toLocaleDateString(
                      "en-GB"
                    )}{" "}
                    <span className="text-gray-400 text-sm">
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
                              new Date(
                                breeding.expected_farrow_date
                              ).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          วัน
                        </>
                      )}
                      )
                    </span>
                  </span>
                </p>
              </div>
            ) : (
              <div className="inline-flex items-start gap-2 text-gray-500">
                <div className="bg-pink-50 text-pink-400 border-pink-400 border p-2 rounded-lg">
                  <Calendar size={22} />
                </div>
                <p className="inline-flex flex-col gap-1">
                  <span className="text-xs">กำหนดคลอด</span>
                  <span className="text-black">
                    {new Date(breeding.expected_farrow_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </span>
                </p>
              </div>
            )}
          </div>
          {breeding.actual_farrow_date && (
            <div className="space-y-4 border p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="inline-flex items-center gap-1">
                  <PiggyBank size={22} /> จำนวนลูกหมูเกิดรอด{" "}
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
                <X size={22} />
                จำนวนลูกหมูไม่รอด
                <span className="font-semibold">
                  {breeding.piglets_born_dead}
                </span>
                ตัว
              </p>
              <p className="border p-4 bg-gray-100 rounded">
                รวมทั้งหมด{" "}
                <span className="font-semibold">
                  {breeding.piglets_born_count! + breeding.piglets_born_dead!}
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
            title="แก้ไขประวัติผสม"
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
