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
  Cake,
  Heart,
  Home,
  Pen,
  PiggyBank,
  PiggyBankIcon,
  Plus,
  PlusIcon,
  Syringe,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CountdownBadge from "@/components/CountdownBadge";
import TabsComponent from "@/components/TabsComponent";
import { Breeding } from "@/types/breeding";
import { MedicalRecordForm } from "@/components/MedicalRecord/Form";
import { MedicalRecord } from "@/types/medicalRecord";
import { useBreedingStore } from "@/stores/useBreedingStore";
import { useMedicalRecordStore } from "@/stores/useMedicalRecordStore";
import { useSowStore } from "@/stores/useSowStore";
import { redirect } from "next/navigation";
import InfoIcon from "@/components/InfoIcon";
import { cn } from "@/lib/utils";
import { kanitFont } from "@/utils/fonts";

export default function SowsPage({ params }: any) {
  const [id, setId] = useState<number | null>();
  const { sow, setSow } = useSowStore();
  const { breedings, setBreedings } = useBreedingStore();
  const { medicalRecords: medical_records, setMedicalRecords } =
    useMedicalRecordStore();
  const [isLoading, setIsLoading] = useState(true);

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
      content: breedings[0]?.actual_farrow_date ? (
        <NewBreedingForm id={sow?.id?.toString()} />
      ) : (
        <div className="text-center text-gray-400 py-20 text-sm">
          ไม่สามารถเพิ่มประวัติผสม
          <br />
          เนื่องจากยังไม่มีการบันทึกวันคลอดของการผสมล่าสุด
        </div>
      ),
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
      try {
        let sow = await getSowByIdWithAllInfo(id);

        if (sow) {
          setSow(sow);
          setBreedings(sow.breedings);
          setMedicalRecords(sow.medical_records);
          setIsLoading(false);
        }
      } catch (error) {
        if (error) redirect("/404");
      }
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
          <h1 className="text-2xl inline-flex items-center gap-4">
            <PiggyBankIcon size={32} className="inline" />
            {sow.name}
          </h1>
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

      <Card>
        <CardHeader>
          <p className="font-bold">รายละเอียด</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <InfoIcon
              label="สถานะ"
              icon={
                sow.is_active ? (
                  sow.is_available ? (
                    <PiggyBank size={22} />
                  ) : (
                    <Heart size={22} />
                  )
                ) : (
                  <X size={22} />
                )
              }
              className="text-gray-500"
            >
              {sow.is_active ? (
                sow.is_available ? (
                  <span className="text-emerald-600 inline-flex items-center gap-1">
                    พร้อมผสม
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="text-pink-500 inline-flex items-center gap-1">
                      ตั้งครรภ์
                    </span>
                    <CountdownBadge date={breedings[0]?.expected_farrow_date} />
                  </span>
                )
              ) : (
                <div>ไม่อยู่</div>
              )}
            </InfoIcon>

            <InfoIcon
              label="วันเกิด"
              icon={<Cake size={22} />}
              className="text-gray-500"
            >
              {sow.birth_date
                ? new Date(sow.birth_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </InfoIcon>
            <InfoIcon
              label="เพิ่มเมื่อ"
              icon={<PlusIcon size={22} />}
              className="text-gray-500"
            >
              {sow.add_date
                ? new Date(sow.add_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </InfoIcon>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl">ประวัติแม่พันธุ์</h2>
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
        <div className="flex flex-col gap-4">
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
        <div className="flex flex-col gap-4">
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
