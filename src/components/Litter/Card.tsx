import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Litter } from "@/types/litter";
import DialogComponent from "../DialogComponent";
import { Button } from "../ui/button";
import {
  PiggyBank,
  Dna,
  Fence,
  Pen,
  Cake,
  Beef,
  Banknote,
  Gauge,
} from "lucide-react";
import { LitterForm } from "./Form";
import { cn, formatDate } from "@/lib/utils";
import InfoIcon from "../InfoIcon";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Sow } from "@/types/sow";

interface ExtendedLitter extends Litter {
  sow: Sow | undefined;
}

export default function LitterCard({
  litter,
  index,
}: {
  litter: ExtendedLitter;
  index: number;
}) {
  if (!litter) return null;
  return (
    <Card key={litter.id} className={cn(litter.sold_at && "opacity-70")}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-6">
            <div className="flex gap-2">
              <Fence />
              <div className="flex flex-col ">
                <h3 className="text-lg font-semibold">ครอกที่ {index}</h3>
                <p className="text-sm">
                  {litter.sold_at && (
                    <>
                      <span className="text-green-700">ขายแล้ว · </span>
                    </>
                  )}
                  {litter.fattening_at && !litter.sold_at && (
                    <span className="text-orange-500">กำลังขุน · </span>
                  )}
                  <span className="text-muted-foreground">
                    {`อายุ 
                              ${Math.floor(
                                ((litter.sold_at
                                  ? new Date(litter.sold_at).getTime()
                                  : new Date().getTime()) -
                                  new Date(litter.birth_date!).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )} วัน`}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InfoIcon icon={<PiggyBank size={22} />} label="จำนวน">
                {litter.piglets_born_count} ตัว
                <span className="ml-2 space-x-1">
                  <span className="bg-blue-500 font-bold text-white rounded-full px-3 py-1 text-xs">
                    ผู้ {litter.piglets_male_born_alive}
                  </span>
                  <span className="bg-pink-500 font-bold text-white rounded-full px-3 py-1 text-xs">
                    เมีย {litter.piglets_female_born_alive}
                  </span>
                </span>
              </InfoIcon>
              {litter.avg_weight ? (
                <InfoIcon icon={<Gauge size={22} />} label="น้ำหนักเฉลี่ย">
                  {litter.avg_weight
                    ? litter.avg_weight.toFixed(2) + " กิโลกรัม"
                    : "ไม่ระบุ"}
                </InfoIcon>
              ) : null}
            </div>
            <div className="flex flex-col gap-4 text-muted-foreground">
              <Link
                href={`/sows/${litter.sow?.id}`}
                className="rounded-lg p-3 bg-gray-100"
              >
                <InfoIcon
                  icon={<PiggyBank size={22} />}
                  label="แม่พันธุ์"
                  className="!bg-white"
                >
                  {litter.sow?.name || "ไม่ระบุ"}
                </InfoIcon>
              </Link>
              {litter.boars && (
                <Link
                  href={`/boars/${litter.boars?.id || ""}`}
                  className="rounded-lg p-3 bg-gray-100"
                >
                  <InfoIcon
                    icon={<Dna size={22} />}
                    label="พ่อพันธุ์"
                    className="!bg-white"
                  >
                    {litter.boars.breed}
                  </InfoIcon>
                </Link>
              )}
              {litter.boars?.name && (
                <Badge variant="outline">พ่อหมู: {litter.boars.breed}</Badge>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <div className="relative">
                <InfoIcon
                  icon={<Cake size={22} />}
                  label="คลอดเมื่อ"
                  className="bg-white"
                >
                  {formatDate(litter.birth_date!)}
                </InfoIcon>
                {litter.fattening_at && (
                  <div className="w-[0px] border-l-2 border-gray-300 -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
                )}
              </div>
              {litter.fattening_at && (
                <div className="relative">
                  <InfoIcon
                    icon={<Beef size={22} />}
                    label="เข้าคอกขุนเมื่อ"
                    className="bg-white"
                  >
                    {formatDate(litter.fattening_at)}
                  </InfoIcon>
                  {litter.fattening_at && !litter.sold_at && (
                    <div className="w-[0px] border-l-2 border-gray-300 border-dashed -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
                  )}
                  {litter.sold_at && (
                    <div className="w-[0px] border-l-2 border-gray-300 -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
                  )}
                </div>
              )}
              {litter.fattening_at && !litter.sold_at && (
                <InfoIcon
                  icon={<Banknote size={22} className="bg-white" />}
                  label="พร้อมขายประมาณ"
                  className="bg-white"
                >
                  {formatDate(litter.saleable_at!)}
                </InfoIcon>
              )}
              {litter.sold_at && (
                <InfoIcon
                  icon={<Banknote size={22} className="bg-white" />}
                  label="ขายแล้วเมื่อ"
                  className="bg-white"
                >
                  {formatDate(litter.sold_at)}
                </InfoIcon>
              )}
              {/* <InfoIcon
                          icon={<Banknote size={22} className="bg-white" />}
                          label="พร้อมขายในช่วง"
                          className="bg-white"
                        >
                          {formatDate(litter.birth_date!)}
                        </InfoIcon> */}
            </div>
          </div>

          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <InfoIcon
                        icon={<Baby size={22} className="text-blue-500" />}
                        label="เพศผู้"
                      >
                        {litter.piglets_male_born_alive || 0}
                      </InfoIcon>
                      <InfoIcon
                        icon={<Heart size={22} className="text-pink-500" />}
                        label="เพศเมีย"
                      >
                        {litter.piglets_female_born_alive || 0}
                      </InfoIcon> */}
          {/* <InfoIcon
                        icon={<Calendar size={22} />}
                        label="ตาย"
                        className="border-red-200 bg-red-50"
                      >
                        {litter.piglets_born_dead || 0}
                      </InfoIcon> */}
          {/* </div> */}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-end gap-2">
          <DialogComponent
            title={`แก้ไขข้อมูลครอกที่ ${index}`}
            dialogTriggerButton={
              <Button variant={"ghost"}>
                <Pen /> แก้ไขข้อมูล
              </Button>
            }
          >
            <LitterForm litter={litter} />
          </DialogComponent>
        </div>
      </CardFooter>
    </Card>
  );
}
