import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Litter } from "@/types/litter";
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
import { FarrowForm, NewLitterForm } from "./Form";
import { cn, formatDate } from "@/lib/utils";
import InfoIcon from "../InfoIcon";
import Link from "next/link";

export default function LitterCard({
  litter,
  index,
}: {
  litter: Litter;
  index: number;
}) {
  if (!litter) return null;
  return (
    <Card
      className={cn(
        litter.actual_farrow_date ? "" : "border bg-pink-50 border-pink-200",
        litter.is_aborted ? "opacity-50" : ""
      )}
    >
      {/* <CardHeader>
        <p
          className={cn(
            litter.actual_farrow_date ? "text-black" : "text-pink-500",
            "font-bold inline-flex items-center gap-1"
          )}
        >
          <Heart
            size={22}
            className={cn(!litter.actual_farrow_date && "animate-bounce")}
          />
          ผสมครั้งที่ {index}{" "}
          <span className="font-normal">
            {!litter.actual_farrow_date && (
              <>
                (คลอดใน{" "}
                {Math.ceil(
                  (new Date(litter.expected_farrow_date).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                วัน)
              </>
            )}
          </span>
        </p>
      </CardHeader> */}
      <CardContent className="p-6 space-y-6">
        <div
          className={cn(
            litter.actual_farrow_date ? "text-black" : "text-pink-500",
            "font-bold inline-flex items-center gap-2"
          )}
        >
          <Heart
            size={22}
            className={cn(!litter.actual_farrow_date && "animate-bounce")}
          />
          <h3 className="text-lg font-semibold">
            ผสมครั้งที่ {index} {litter.is_aborted && "(แท้ง)"}
            <span className="font-normal">
              {!litter.actual_farrow_date && (
                <>
                  (คลอดใน{" "}
                  {Math.ceil(
                    (new Date(litter.expected_farrow_date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
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
                litter.actual_farrow_date
                  ? "bg-gray-100 text-muted-foreground"
                  : "!text-pink-400 border-pink-300"
              )}
            >
              {formatDate(litter.breed_date)}
            </InfoIcon>
            {litter.actual_farrow_date ? (
              <div className="w-[0px] border-l-2 border-gray-300 -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
            ) : (
              <div className="w-[0px] border-l-2 border-pink-500 border-dashed -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
            )}

            {litter.actual_farrow_date ? (
              <InfoIcon label="คลอดเมื่อ" icon={<CalendarCheck size={22} />}>
                {formatDate(litter.actual_farrow_date)}{" "}
                <span className="text-gray-400 text-sm">
                  (
                  {new Date(litter.actual_farrow_date) <
                  new Date(litter.expected_farrow_date) ? (
                    <>
                      ก่อนกำหนด{" "}
                      {Math.ceil(
                        (new Date(litter.expected_farrow_date).getTime() -
                          new Date(litter.actual_farrow_date).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      วัน
                    </>
                  ) : (
                    <>
                      หลังกำหนด{" "}
                      {Math.ceil(
                        (new Date(litter.actual_farrow_date).getTime() -
                          new Date(litter.expected_farrow_date).getTime()) /
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
                  litter.actual_farrow_date
                    ? "bg-gray-100 text-muted-foreground"
                    : "!text-pink-400 border-pink-300"
                )}
              >
                {formatDate(litter.expected_farrow_date)}
              </InfoIcon>
            )}
            {litter.boars && (
              <Link
                href={`/boars/${litter.boars.id}`}
                className={cn(
                  "p-3 rounded-lg",
                  litter.actual_farrow_date
                    ? "bg-gray-100"
                    : "border-pink-300 bg-pink-100"
                )}
              >
                <InfoIcon
                  label="ผสมกับพ่อพันธุ์"
                  icon={<Dna size={22} />}
                  className={cn(
                    litter.actual_farrow_date
                      ? "!bg-white text-muted-foreground"
                      : "!text-pink-400 border-pink-300"
                  )}
                >
                  {litter.boars.breed}
                </InfoIcon>
              </Link>
            )}
          </div>
          {litter.actual_farrow_date && (
            <div className="space-y-4 p-3 bg-gray-100 rounded-lg">
              <div>
                <InfoIcon
                  label="จำนวนลูกเกิดรอด"
                  icon={<PiggyBank size={22} />}
                  className="!bg-white text-muted-foreground"
                >
                  {litter.piglets_born_count} ตัว{" "}
                  <span className="ml-2">
                    <span className="bg-blue-500 font-bold text-white rounded-full px-3 py-1 text-xs">
                      ผู้ {litter.piglets_male_born_alive}
                    </span>{" "}
                    <span className="bg-pink-500 font-bold text-white rounded-full px-3 py-1 text-xs">
                      เมีย {litter.piglets_female_born_alive}
                    </span>
                  </span>
                </InfoIcon>
                {/* <div className="flex gap-2 mt-2 ml-10">
                  <p className="text-blue-500 border border-blue-300 p-2 bg-blue-50 rounded">
                    ผู้ {litter.piglets_male_born_alive}
                  </p>
                  <p className="text-pink-500 border border-pink-300 p-2 bg-pink-50 rounded">
                    เมีย {litter.piglets_female_born_alive}
                  </p>
                </div> */}
              </div>
              <InfoIcon
                label="จำนวนลูกเกิดตาย"
                icon={<X size={22} />}
                className="!bg-white text-muted-foreground"
              >
                {litter.piglets_born_dead} ตัว
              </InfoIcon>
              <p className="p-4 bg-white rounded">
                รวมทั้งหมด{" "}
                <span className="font-semibold">
                  {litter.piglets_born_count! + litter.piglets_born_dead!}
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
            {litter.actual_farrow_date ? (
              <FarrowForm litter={litter} />
            ) : (
              <NewLitterForm litter={litter} />
            )}
          </DialogComponent>
          {litter.actual_farrow_date === null && (
            <DialogComponent
              title="บันทึกการคลอด"
              dialogTriggerButton={
                <Button>
                  <Check /> บันทึกการคลอด
                </Button>
              }
            >
              <FarrowForm litter={litter} />
            </DialogComponent>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
