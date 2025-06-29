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
import { cn } from "@/lib/utils";
import InfoIcon from "../InfoIcon";
import Link from "next/link";

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
        breeding.actual_farrow_date ? "" : "border bg-pink-50 border-pink-200"
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
            <InfoIcon
              label="ผสมเมื่อ"
              icon={<CalendarHeart size={22} />}
              className={cn(
                breeding.actual_farrow_date
                  ? "bg-gray-50 text-muted-foreground"
                  : "!text-pink-400 border-pink-300"
              )}
            >
              {new Date(breeding.breed_date).toLocaleDateString("en-GB")}
            </InfoIcon>
            {breeding.actual_farrow_date ? (
              <InfoIcon label="คลอดเมื่อ" icon={<CalendarCheck size={22} />}>
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
                    ? "bg-gray-50 text-muted-foreground"
                    : "!text-pink-400 border-pink-300"
                )}
              >
                {new Date(breeding.expected_farrow_date).toLocaleDateString(
                  "en-GB"
                )}
              </InfoIcon>
            )}
            {breeding.boars && (
              <Link
                href={`/boars/${breeding.boars.id}`}
                className={cn(
                  "p-3 rounded-lg",
                  breeding.actual_farrow_date
                    ? "bg-gray-50"
                    : "border-pink-300 bg-pink-100"
                )}
              >
                <InfoIcon
                  label="ผสมกับพ่อพันธุ์"
                  icon={<Dna size={22} />}
                  className={cn(
                    breeding.actual_farrow_date
                      ? "!bg-white text-muted-foreground"
                      : "!text-pink-400 border-pink-300"
                  )}
                >
                  {breeding.boars.breed}
                </InfoIcon>
              </Link>
            )}
          </div>
          {breeding.actual_farrow_date && (
            <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <InfoIcon
                  label="จำนวนลูกเกิดรอด"
                  icon={<PiggyBank size={22} />}
                  className="!bg-white text-muted-foreground"
                >
                  {breeding.piglets_born_count} ตัว
                </InfoIcon>
                <div className="flex gap-2 mt-2 ml-10">
                  <p className="text-blue-500 border border-blue-300 p-2 bg-blue-50 rounded">
                    ผู้ {breeding.piglets_male_born_alive}
                  </p>
                  <p className="text-pink-500 border border-pink-300 p-2 bg-pink-50 rounded">
                    เมีย {breeding.piglets_female_born_alive}
                  </p>
                </div>
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
