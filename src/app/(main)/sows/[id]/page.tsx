"use client";

import BreedingCard from "@/components/Breeding/Card";
import MedicalRecordCard from "@/components/MedicalRecord/Card";
import SowForm from "@/components/Sow/Form";
import { Button } from "@/components/ui/button";
import { getSowByIdWithAllInfo } from "@/services/sow";
import { Sow } from "@/types/sow";
import { useEffect, useMemo, useState } from "react";

import { NewBreedingForm } from "@/components/Breeding/Form";
import DialogComponent from "@/components/DialogComponent";
import {
  Cake,
  Dna,
  HandHeart,
  Heart,
  Pen,
  PiggyBank,
  PiggyBankIcon,
  Plus,
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
import PigletCountChart from "@/components/PigletCountChart";
import { formatDate } from "@/lib/utils";
import AvgWeightChart from "@/components/AvgWeightChart";
import { getLittersBySowId } from "@/services/litter";
import { Litter } from "@/types/litter";
import { useBoarStore } from "@/stores/useBoarStore";
import { getAllBoars } from "@/services/boar";

export default function SowsPage({ params }: any) {
  const [id, setId] = useState<number | null>();
  const { sow, setSow } = useSowStore();
  const { breedings, setBreedings } = useBreedingStore();
  const { boars, setBoars } = useBoarStore();
  const [litters, setLitters] = useState<Litter[]>([]);
  const { medicalRecords: medical_records, setMedicalRecords } =
    useMedicalRecordStore();
  const [isLoading, setIsLoading] = useState(true);

  const sowBreeds = useMemo(() => {
    if (!sow?.breed_ids || !boars.length) return [];
    return sow.breed_ids
      .map((breedId) => boars.find((boar) => boar.id === breedId))
      .filter(Boolean);
  }, [sow?.breed_ids, boars]);

  const averagePigletsBornCount = useMemo(
    () =>
      Math.floor(
        breedings.reduce(
          (acc, breeding) => acc + (breeding.piglets_born_count || 0),
          0
        ) /
          breedings.filter(
            (breeding) =>
              breeding.actual_farrow_date &&
              breeding.piglets_born_count !== null &&
              !breeding.is_aborted
          ).length
      ),
    [breedings]
  );

  const averageWeightChart = useMemo(
    () =>
      Math.floor(
        litters.reduce((acc, litter) => acc + (litter.avg_weight || 0), 0) /
          litters.filter((litter) => litter.avg_weight! > 0).length
      ),
    [breedings]
  );

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
      content:
        breedings.length === 0 || breedings[0]?.actual_farrow_date ? (
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
        let litters = await getLittersBySowId(id);

        if (sow) {
          setSow(sow);
          setBreedings(sow.breedings);
          setMedicalRecords(sow.medical_records);

          if (sow.breed_ids?.length && !boars.length) {
            const data = await getAllBoars();
            setBoars(data);
          }

          setIsLoading(false);
        }

        if (litters) {
          setLitters(litters);
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
          <h1 className="text-2xl inline-flex items-center gap-3">
            <PiggyBankIcon size={32} className="inline" />
            {sow.name}
          </h1>
          {sow.is_active && (
            <div>
              <div className="absolute top-0 -right-3 w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <div className="absolute top-0 -right-3 w-2 h-2 rounded-full bg-green-500" />
            </div>
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
              className="text-muted-foreground"
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
              className="text-muted-foreground"
            >
              {sow.birth_date ? (
                <>
                  {formatDate(sow.birth_date)}{" "}
                  <span className="text-muted-foreground">
                    (
                    {`อายุ 
                  ${Math.floor(
                    (new Date().getTime() -
                      new Date(sow.birth_date!).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} วัน`}
                    )
                  </span>
                </>
              ) : (
                "-"
              )}{" "}
            </InfoIcon>
            <InfoIcon
              label="รับเข้าเมื่อ"
              icon={<HandHeart size={22} />}
              className="text-muted-foreground"
            >
              {sow.add_date ? formatDate(sow.add_date) : "-"}
            </InfoIcon>
            <div className="flex flex-col gap-4">
              {sowBreeds.length > 0 ? (
                sowBreeds.map((breed, index) => (
                  <div
                    key={breed?.id || index}
                    className="flex flex-col gap-4 bg-gray-100 p-3 rounded-lg"
                  >
                    <InfoIcon
                      label="สายพันธุ์"
                      icon={<Dna size={22} />}
                      className="text-muted-foreground !bg-white"
                    >
                      {breed?.breed || "ไม่ระบุ"}
                    </InfoIcon>
                  </div>
                ))
              ) : (
                <div className="flex flex-col gap-4 bg-gray-100 p-3 rounded-lg">
                  <InfoIcon
                    label="สายพันธุ์"
                    icon={<Dna size={22} />}
                    className="text-muted-foreground !bg-white"
                  >
                    ไม่ระบุ
                  </InfoIcon>
                </div>
              )}
            </div>
            {breedings.filter(
              (breeding) =>
                breeding.actual_farrow_date &&
                breeding.piglets_born_count !== null &&
                !breeding.is_aborted
            ).length > 1 && (
              <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    จำนวนลูกเกิดรอดเฉลี่ย
                  </p>
                  <p className="text-xl font-semibold">
                    {averagePigletsBornCount} ตัว
                  </p>
                </div>
                <PigletCountChart breedings={breedings} />
              </div>
            )}{" "}
            {litters.filter((breeding) => breeding.avg_weight! > 0).length >
              1 && (
              <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    น้ำหนักลูกหมูเฉลี่ย
                  </p>
                  <p className="text-xl font-semibold">
                    {averageWeightChart} กิโลกรัม
                  </p>
                </div>
                <AvgWeightChart litters={litters} />
              </div>
            )}
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
        <div className="text-center pt-20 text-muted-foreground">
          ไม่มีประวัติผสม
        </div>
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
        <div className="text-center pt-20 text-muted-foreground">
          ไม่มีประวัติใช้ยา
        </div>
      )}
    </div>
  );
};
