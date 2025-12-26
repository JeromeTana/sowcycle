"use client";

import { Litter } from "@/types/litter";
import { Sow } from "@/types/sow";
import { Button } from "../ui/button";
import {
  Check,
  PiggyBank,
  Beef,
  Banknote,
  Gauge,
  Plus,
  Cake,
  ChevronRight,
  Dna,
  Pencil,
  Trash2,
} from "lucide-react";
import DrawerDialog from "../DrawerDialog";
import { LitterForm } from "./Form";
import { AddToCalendarButton } from "../AddToCalendarButton";
import BoarDetailsCard from "../Boar/DetailsCard";
import { DeleteDialog } from "./DeleteDialog";
import { useMemo } from "react";
import { SowTags } from "../Sow/SowTags";
import { formatDateTH } from "@/lib/utils";

interface ExtendedLitter extends Litter {
  sows: Sow | undefined;
}

interface LitterDrawerProps {
  litter: ExtendedLitter;
  index: number;
}

export default function LitterDrawer({ litter, index }: LitterDrawerProps) {
  const ageInDays = useMemo(() => {
    const endDate = litter.sold_at ? new Date(litter.sold_at) : new Date();
    const birthDate = new Date(litter.birth_date!);
    return Math.floor(
      (endDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [litter.birth_date, litter.sold_at]);

  const isSold = !!litter.sold_at;
  const isFattening = !!litter.fattening_at && !isSold;
  const isBorn = !litter.fattening_at;

  return (
    <div className="space-y-4">
      {/* Stats Section */}
      <div className="space-y-4">
        {/* Count Stats */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 p-2 bg-gray-100 rounded-2xl text-muted-foreground">
            <PiggyBank size={24} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-muted-foreground text-sm mb-0.5">จำนวน</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {litter.piglets_born_count} ตัว
              </span>
              <div className="flex gap-1">
                <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                  ผู้ {litter.piglets_male_born_alive}
                </span>
                <span className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                  เมีย {litter.piglets_female_born_alive}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Stats (Only if Sold) */}
        {isSold && litter.avg_weight && (
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 p-2 bg-gray-100 rounded-2xl text-muted-foreground">
              <Gauge size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-muted-foreground text-sm mb-0.5">
                น้ำหนักขายเฉลี่ย
              </p>
              <span className="font-semibold text-gray-900">
                {litter.avg_weight} kg
              </span>
            </div>
          </div>
        )}

        {/* Parents Info */}
        {/* Sow */}
        {litter.sows && (
          <div className="flex justify-between w-full p-3 bg-secondary rounded-xl">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-12 h-12 p-2 bg-white text-muted-foreground rounded-2xl">
                <PiggyBank size={24} />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-sm text-muted-foreground">แม่พันธุ์</p>
                <span className="font-semibold text-gray-900">
                  {litter.sows.name}
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <SowTags
                    breedIds={litter.sows.breed_ids}
                    breastsCount={litter.sows.breasts_count}
                  />
                </div>
              </div>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>
        )}

        {/* Boar */}
        {litter.boars && (
          <DrawerDialog
            title={litter.boars.breed}
            dialogTriggerButton={
              <div className="flex justify-between w-full p-3 cursor-pointer bg-secondary rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 p-2 bg-white text-muted-foreground rounded-2xl">
                    <Dna size={24} />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-sm text-muted-foreground">พ่อพันธุ์</p>
                    <span className="font-semibold text-gray-900">
                      {litter.boars.breed}
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            }
          >
            <BoarDetailsCard boar={litter.boars} />
          </DrawerDialog>
        )}

        {/* Timeline */}
        <div className="relative flex flex-col gap-4 p-4 bg-secondary rounded-xl">
          {/* Vertical Line */}
          {(isFattening || isSold) && (
            <div className="absolute left-10 top-6 bottom-6 w-[2px] bg-gray-200 -z-0" />
          )}

          {/* Born */}
          <div className="relative flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 p-2 bg-white rounded-2xl text-muted-foreground">
              <Cake size={24} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-muted-foreground text-sm mb-0.5">คลอดเมื่อ</p>
              <span className="font-semibold text-gray-900">
                {formatDateTH(litter.birth_date!, true, true, true)}
              </span>
            </div>
          </div>

          {/* Fattening */}
          {(isFattening || isSold) && (
            <div className="relative flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 p-2 bg-white rounded-2xl text-muted-foreground">
                <Beef size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-muted-foreground text-sm mb-0.5">
                  เริ่มขุนเมื่อ
                </p>
                <span className="font-semibold text-gray-900">
                  {litter.fattening_at
                    ? formatDateTH(litter.fattening_at, true, true, true)
                    : "ไม่ระบุ"}{" "}
                </span>
              </div>
            </div>
          )}

          {/* Sale */}
          {(isFattening || isSold) && (
            <div className="relative flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 p-2 bg-white rounded-2xl text-muted-foreground">
                <Banknote size={24} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-muted-foreground text-sm mb-0.5">
                  {isSold ? "ขายแล้วเมื่อ" : "กำหนดขาย"}
                </p>
                <span className="font-semibold text-gray-900">
                  {isSold
                    ? formatDateTH(litter.sold_at!, true, true, true)
                    : formatDateTH(litter.saleable_at!, true, true, true)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {/* Add Fattening Button */}
        {isBorn && (
          <DrawerDialog
            title="เพิ่มวันเริ่มขุน"
            dialogTriggerButton={
              <Button
                variant="secondary"
                size="lg"
                className="w-full text-base font-medium"
              >
                <Plus className="w-5 h-5 mr-2" /> เพิ่มวันเริ่มขุน
              </Button>
            }
          >
            <LitterForm litter={litter} mode="fattening" />
          </DrawerDialog>
        )}

        {/* Record Sale Button */}
        {isFattening && (
          <DrawerDialog
            title="บันทึกวันขาย"
            dialogTriggerButton={
              <Button className="w-full h-12 text-base font-medium text-white bg-lime-500 rounded-full shadow-none hover:bg-[#65a30d]">
                <Check className="w-5 h-5 mr-2" /> บันทึกวันขาย
              </Button>
            }
          >
            <LitterForm litter={litter} mode="sale" />
          </DrawerDialog>
        )}

        {/* Add to Calendar */}
        {isFattening && litter.saleable_at && (
          <AddToCalendarButton
            title={`กำหนดจับหมูขุน แม่${litter.sows?.name}`}
            startDate={new Date(litter.saleable_at)}
            className="w-full h-12 text-base font-medium text-gray-900 bg-gray-100 border-none rounded-full shadow-none hover:bg-gray-200"
          />
        )}

        {/* Edit Button */}
        <DrawerDialog
          title="แก้ไขข้อมูล"
          dialogTriggerButton={
            <Button
              variant="secondary"
              className="w-full h-12 text-base font-medium border-gray-200 rounded-full"
            >
              <Pencil className="w-4 h-4 mr-2" /> แก้ไขข้อมูล
            </Button>
          }
        >
          <LitterForm litter={litter} mode="edit" />
        </DrawerDialog>

        {/* Delete Button */}
        {/* <DeleteDialog
          litter={litter}
          isSubmitting={false}
          trigger={
            <Button
              variant="ghost"
              className="w-full h-12 text-base font-medium text-red-500 rounded-full hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" /> ลบข้อมูล
            </Button>
          }
        /> */}
      </div>
    </div>
  );
}
