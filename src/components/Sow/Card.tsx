"use client";

import { Sow } from "@/types/sow";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  Check,
  ChevronRight,
  Milk,
  PiggyBank,
  Plus,
} from "lucide-react";

import { FarrowForm, NewBreedingForm } from "../Breeding/Form";
import DialogComponent from "../DialogComponent";
import { cn } from "@/lib/utils";
import { AddToCalendarButton } from "../AddToCalendarButton";

export default function SowCard({ sow }: { sow: Sow }) {
  const latestBreeding = sow.breedings?.[0];
  const isPregnant = !sow.is_available && sow.is_active;

  const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      month: "long",
      day: "numeric",
    });
  };

  const getDaysDiff = (dateStr: string) => {
    const diffTime = new Date().getTime() - new Date(dateStr).getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysRemaining = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="w-full overflow-hidden transition-all bg-white border-none shadow-none rounded-2xl">
      <Link href={`/sows/${sow.id}`}>
        <CardContent className="p-4 pb-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn("text-xl font-bold", 
              sow.is_available ? "text-black" : " text-pink-500"
            )}>
              {sow.name}
            </h3>
            <ChevronRight size={20} className="text-gray-300" />
          </div>

          {/* Tags
          <div className="flex flex-wrap gap-2 mb-8">
            {sow.breasts_count > 0 && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full text-gray-500 text-sm font-medium">
                <Milk size={16} />
                <span>{sow.breasts_count} เต้า</span>
              </div>
            )}
          </div> */}

          {/* Status Info */}
          <div className="flex items-start gap-5 mb-4">
            <div
              className={cn(
                "p-2 rounded-2xl flex items-center justify-center w-12 h-12 bg-gray-100",
                isPregnant ? " text-pink-500" : " text-gray-400"
              )}
            >
              <PiggyBank size={24} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center h-16">
              <p className="text-gray-400 text-sm mb-0.5">
                กำหนดคลอด
              </p>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-gray-900">
                  {isPregnant
                    ? formatDateDisplay(latestBreeding.expected_farrow_date!)
                    : (latestBreeding?.actual_farrow_date ? formatDateDisplay(latestBreeding.actual_farrow_date) : "พร้อมผสม")}
                </span>
                
                {isPregnant && latestBreeding?.expected_farrow_date && (
                  <span className="text-sm font-medium text-pink-500">
                    ภายใน {getDaysRemaining(latestBreeding.expected_farrow_date)} วัน
                  </span>
                )}

                {!isPregnant && latestBreeding?.actual_farrow_date && (
                  <span className="text-sm text-gray-400">
                    {getDaysDiff(latestBreeding.actual_farrow_date)} วันที่แล้ว
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex flex-col gap-3 p-4 pt-2 ">
        {isPregnant && latestBreeding ? (
          <div className="w-full space-y-2">
            <DialogComponent
              title="บันทึกการคลอด"
              dialogTriggerButton={
                <Button size="lg" className="w-full h-12 text-base font-medium text-white bg-pink-500 rounded-full shadow-none hover:bg-pink-600">
                  <Check className="w-5 h-5 mr-2" /> บันทึกการคลอด
                </Button>
              }
            >
              <FarrowForm breeding={latestBreeding} />
            </DialogComponent>

            <AddToCalendarButton
              title={`กำหนดคลอด ${sow.name}`}
              startDate={new Date(latestBreeding.expected_farrow_date!)}
              className="w-full h-12 text-base font-medium text-gray-900 bg-gray-100 border-none rounded-full shadow-none hover:bg-gray-200"
            />
          </div>
        ) : (
          <div className="w-full">
             <DialogComponent
              title="เพิ่มประวัติผสม"
              dialogTriggerButton={
                <Button
                  disabled={!sow.is_active}
                  size="lg"
                  variant="secondary"
                  className="w-full h-12 text-base font-medium text-gray-900 bg-gray-100 rounded-full shadow-none hover:bg-gray-200"
                >
                  <Plus className="w-5 h-5 mr-2" /> เพิ่มประวัติ
                </Button>
              }
            >
              <NewBreedingForm id={sow.id.toString()} />
            </DialogComponent>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
