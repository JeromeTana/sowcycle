"use client";

import BreedingCard from "@/components/Breeding/Card";
import SowForm from "@/components/Sow/Form";
import { Button } from "@/components/ui/button";
import { getBreedingsBySowId } from "@/services/breeding";
import { getSowById } from "@/services/sow";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import { useEffect, useState } from "react";

import { NewBreedingForm } from "@/components/Breeding/Form";
import DialogComponent from "@/components/DialogComponent";
import { Heart, Pen, PiggyBank, PiggyBankIcon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SowsPage({ params }: any) {
  const [id, setId] = useState<number | null>();
  const [sow, setSow] = useState<Sow>({} as Sow);
  const [breedings, setBreedings] = useState<Breeding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getParamsId = async () => {
      const { id } = await params;
      setId(id);
    };
    getParamsId();
    return () => {};
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      let sow = await getSowById(id);
      if (!sow) return;
      setSow(sow);

      let breeding = await getBreedingsBySowId(id);
      if (!breeding) return;
      setBreedings(breeding);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading)
    return (
      <div>
        <div className="flex justify-between">
          <Skeleton className=" w-40 h-8" />
          <Skeleton className=" w-32 h-8" />
        </div>
        <Skeleton className="w-full h-32 mt-4 rounded-xl" />
        <div className="flex justify-between mt-8">
          <Skeleton className=" w-40 h-8" />
          <Skeleton className=" w-32 h-8" />
        </div>
        <Skeleton className="w-full h-80 mt-4 rounded-xl" />
        <Skeleton className="w-full h-80 mt-2 rounded-xl" />
      </div>
    );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="relative">
          <p className="text-2xl font-bold inline-flex items-center gap-1">
            <PiggyBankIcon size={32} className="inline" />
            {sow.name}
          </p>
          {sow.is_active && (
            <div className="absolute top-0 -right-3 w-1 h-1 rounded-full bg-green-500 animate-ping" />
          )}
        </div>
        <div className="flex">
          <DialogComponent
            title="แก้ไขแม่พันธุ์"
            dialogTriggerButton={
              <Button variant={"ghost"}>
                <Pen /> แก้ไขแม่พันธุ์
              </Button>
            }
          >
            <SowForm editingSow={sow} />
          </DialogComponent>
        </div>
      </div>

      <Card className={sow.is_active ? "" : "opacity-50"}>
        <CardHeader>
          <p className="font-bold">รายละเอียด</p>
        </CardHeader>
        <CardContent>
          {sow.is_active ? (
            sow.is_available ? (
              <p className="text-emerald-600 inline-flex items-center gap-1">
                <PiggyBank size={16} />
                พร้อมผสม
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-pink-500 inline-flex items-center gap-1">
                  <Heart size={16} />
                  ตั้งครรภ์
                </p>
                <p className="text-sm inline-flex gap-1 items-center bg-pink-500 text-white py-1 px-2 rounded-full">
                  คลอดใน{" "}
                  {Math.ceil(
                    (new Date(breedings[0].expected_farrow_date).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  วัน
                </p>
              </div>
            )
          ) : (
            <div>แม่พันธุ์ไม่อยู่ในขณะนี้</div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <p className="text-xl font-bold mb-2">ประวัติผสม</p>
          <DialogComponent
            title="เพิ่มประวัติผสม"
            dialogTriggerButton={
              <Button
                disabled={!sow.is_active || !sow.is_available}
                variant={"outline"}
              >
                <Plus /> เพิ่มประวัติผสม
              </Button>
            }
          >
            <NewBreedingForm id={sow.id.toString()} />
          </DialogComponent>
        </div>
        {breedings.length > 0 ? (
          <div className="flex flex-col gap-2">
            {breedings.map((breeding, index) => (
              <BreedingCard
                index={breedings.length - index}
                key={index}
                breeding={breeding}
              />
            ))}
          </div>
        ) : (
          <div className="text-center pt-20 text-gray-400">ไม่มีประวัติผสม</div>
        )}
      </div>
    </div>
  );
}
