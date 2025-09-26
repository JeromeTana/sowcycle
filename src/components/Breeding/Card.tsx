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
  Dna,
} from "lucide-react";
import { FarrowForm, NewBreedingForm } from "./Form";
import { cn, formatDate } from "@/lib/utils";
import InfoIcon from "../InfoIcon";
import Link from "next/link";
import BoarDetailsCard from "../Boar/DetailsCard";

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
      className={cn(
        breeding.actual_farrow_date ? "" : "border bg-pink-50 border-pink-200",
        breeding.is_aborted ? "opacity-70" : ""
      )}
    >
      <CardContent className="p-6 space-y-6">
        <div
          className={cn(
            breeding.actual_farrow_date ? "text-black" : "text-pink-500",
            "font-bold inline-flex items-center gap-2"
          )}
        >
          <Heart
            size={22}
            className={cn(!breeding.actual_farrow_date && "animate-bounce")}
          />
          <h3 className="text-lg font-semibold">
            ผสมครั้งที่ {index} {breeding.is_aborted && "(แท้ง)"}
            <span className="font-normal">
              {!breeding.actual_farrow_date && (
                <>
                  (คลอดใน{" "}
                  {Math.floor(
                    (new Date(breeding.expected_farrow_date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1}{" "}
                  วัน)
                </>
              )}
            </span>
          </h3>
        </div>
        <div className="space-y-4">
          <div className="relative flex flex-col gap-6">
            <InfoIcon
              label="ผสมเมื่อ"
              icon={<CalendarHeart size={22} />}
              className={cn(
                breeding.actual_farrow_date
                  ? "bg-gray-100 text-muted-foreground"
                  : "!bg-white !text-pink-400 border-pink-300"
              )}
            >
              {formatDate(breeding.breed_date)}
            </InfoIcon>
            {breeding.actual_farrow_date ? (
              <div className="w-[0px] border-l-2 border-gray-300 -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
            ) : (
              <div className="w-[0px] border-l-2 border-pink-500 border-dashed -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
            )}

            {breeding.actual_farrow_date ? (
              <InfoIcon label="คลอดเมื่อ" icon={<CalendarCheck size={22} />}>
                {formatDate(breeding.actual_farrow_date)}{" "}
                <span className="text-gray-400 text-sm">
                  (
                  {new Date(breeding.actual_farrow_date).toDateString() ===
                  new Date(breeding.expected_farrow_date).toDateString() ? (
                    <>ตรงตามกำหนด</>
                  ) : new Date(breeding.actual_farrow_date) <
                    new Date(breeding.expected_farrow_date) ? (
                    <>
                      ก่อนกำหนด{" "}
                      {Math.floor(
                        (new Date(breeding.expected_farrow_date).getTime() -
                          new Date(breeding.actual_farrow_date).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      วัน
                    </>
                  ) : (
                    <>
                      หลังกำหนด{" "}
                      {Math.floor(
                        (new Date(breeding.actual_farrow_date).getTime() -
                          new Date(breeding.expected_farrow_date).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      วัน
                    </>
                  )}
                  )
                </span>
              </InfoIcon>
            ) : (
              <InfoIcon
                label="กำหนดคลอด"
                icon={<Calendar size={22} />}
                className={cn(
                  breeding.actual_farrow_date
                    ? "bg-gray-100 text-muted-foreground"
                    : "!text-pink-400 border-pink-300",
                  "!bg-white"
                )}
              >
                {formatDate(breeding.expected_farrow_date)}
              </InfoIcon>
            )}
            {breeding.boars && (
              <DialogComponent
                title={breeding.boars.breed}
                dialogTriggerButton={
                  <div
                    className={cn(
                      "flex flex-col gap-4 p-3 rounded-lg cursor-pointer",
                      breeding.actual_farrow_date
                        ? "bg-gray-100 text-muted-foreground"
                        : "!bg-pink-100 border !text-pink-400 border-pink-200"
                    )}
                  >
                    <InfoIcon
                      icon={<Dna size={22} />}
                      label="พ่อพันธุ์"
                      className={cn(
                        breeding.actual_farrow_date
                          ? "bg-gray-100 text-muted-foreground"
                          : "!text-pink-400 border-pink-300",
                        "!bg-white"
                      )}
                    >
                      {breeding.boars.breed}{" "}
                    </InfoIcon>
                  </div>
                }
              >
                <BoarDetailsCard boar={breeding.boars} />
              </DialogComponent>
            )}
          </div>
          {breeding.actual_farrow_date && (
            <div className="space-y-4 p-3 bg-gray-100 rounded-lg">
              <div>
                <InfoIcon
                  label="จำนวนลูกเกิดรอด"
                  icon={<PiggyBank size={22} />}
                  className="!bg-white text-muted-foreground"
                >
                  {breeding.piglets_born_count} ตัว{" "}
                  <span className="ml-2">
                    <span className="bg-blue-500 font-bold text-white rounded-full px-3 py-1 text-xs">
                      ผู้ {breeding.piglets_male_born_alive}
                    </span>{" "}
                    <span className="bg-pink-500 font-bold text-white rounded-full px-3 py-1 text-xs">
                      เมีย {breeding.piglets_female_born_alive}
                    </span>
                  </span>
                </InfoIcon>
              </div>
              <InfoIcon
                label="จำนวนลูกเกิดตาย"
                icon={<X size={22} />}
                className="!bg-white text-muted-foreground"
              >
                {breeding.piglets_born_dead} ตัว
              </InfoIcon>
              <p className="p-4 bg-white rounded">
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
