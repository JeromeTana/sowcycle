"use client";

import BreedingCard from "@/components/Breeding/Card";
import MedicalRecordCard from "@/components/MedicalRecord/Card";
import SowForm from "@/components/Sow/Form";
import { Button } from "@/components/ui/button";
import { getSowByIdWithAllInfo } from "@/services/sow";
import { Sow } from "@/types/sow";
import { useEffect, useState } from "react";

import { NewBreedingForm } from "@/components/Breeding/Form";
import DialogComponent from "@/components/DialogComponent";
import {
  Heart,
  Pen,
  PiggyBank,
  PiggyBankIcon,
  Plus,
  Syringe,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CountdownBadge from "@/components/CountdownBadge";
import TabsComponent from "@/components/TabsComponent";
import { Breeding } from "@/types/breeding";
import { MedicalRecordForm } from "@/components/MedicalRecord/Form";
import { MedicalRecord } from "@/types/medicalRecord";

export default function SowsPage({ params }: any) {
  const [id, setId] = useState<number | null>();
  const [sow, setSow] = useState<Sow>({} as Sow);
  const [isLoading, setIsLoading] = useState(true);
  const { breedings, medical_records } = sow;

  const tabOptions = [
    {
      label: (
        <>
          <Heart size={12} />
          &nbsp;ประวัติผสม {breedings?.length > 0 && `(${breedings.length})`}
        </>
      ),
      value: "breeding",
      content: <BreedingRecordContent breedings={breedings} sow={sow} />,
      default: true,
    },
    {
      label: (
        <>
          <Syringe size={12} />
          &nbsp;ประวัติใช้ยา{" "}
          {medical_records?.length > 0 && `(${medical_records.length})`}
        </>
      ),
      value: "medical",
      content: (
        <MedicalRecordContent medicalRecords={medical_records} sow={sow} />
      ),
    },
  ];

  const tabFormOptions = [
    {
      label: (
        <>
          <Heart size={12} />
          &nbsp;ประวัติผสม
        </>
      ),
      value: "breeding",
      content: <NewBreedingForm id={sow?.id?.toString()} />,
      default: true,
    },
    {
      label: (
        <>
          <Syringe size={12} />
          &nbsp;ประวัติใช้ยา
        </>
      ),
      value: "medical",
      content: <MedicalRecordForm id={sow?.id?.toString()} />,
    },
  ];

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
      let sow = await getSowByIdWithAllInfo(id);
      if (!sow) return;
      setSow(sow);
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
    <div className="space-y-8">
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
                <PiggyBank size={20} />
                พร้อมผสม
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-pink-500 inline-flex items-center gap-1">
                  <Heart size={20} />
                  ตั้งครรภ์
                </p>
                <CountdownBadge date={breedings[0].expected_farrow_date} />
              </div>
            )
          ) : (
            <div>แม่พันธุ์ไม่อยู่ในขณะนี้</div>
          )}
        </CardContent>
      </Card>
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="text-xl font-bold ">ประวัติแม่พันธุ์</p>
          <DialogComponent
            title="เพิ่มประวัติใหม่"
            dialogTriggerButton={
              <Button disabled={!sow.is_active}>
                <Plus /> เพิ่มประวัติ
              </Button>
            }
          >
            <TabsComponent tabOptions={tabFormOptions} />
          </DialogComponent>
        </div>
        <TabsComponent tabOptions={tabOptions} />
      </div>
    </div>
  );
}

const BreedingRecordContent = ({
  breedings,
}: {
  breedings: Breeding[];
  sow: Sow;
}) => {
  return (
    <div>
      {breedings?.length > 0 ? (
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
  );
};

const MedicalRecordContent = ({
  medicalRecords,
}: {
  medicalRecords: MedicalRecord[];
  sow: Sow;
}) => {
  return (
    <div>
      {medicalRecords?.length > 0 ? (
        <div className="flex flex-col gap-2">
          {medicalRecords.map((medicalRecord, index) => (
            <MedicalRecordCard
              index={medicalRecords.length - index}
              key={index}
              medicalRecord={medicalRecord}
            />
          ))}
        </div>
      ) : (
        <div className="text-center pt-20 text-gray-400">ไม่มีประวัติใช้ยา</div>
      )}
    </div>
  );
};
