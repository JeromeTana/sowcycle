import { Card, CardContent, CardHeader } from "@/components/ui/card";
import InfoIcon from "@/components/InfoIcon";
import CountdownBadge from "@/components/CountdownBadge";
import PigletCountChart from "@/components/Sow/PigletCountChart";
import AvgWeightChart from "@/components/Sow/AvgWeightChart";
import { formatDate } from "@/lib/utils";
import { Sow } from "@/types/sow";
import { Breeding } from "@/types/breeding";
import { Litter } from "@/types/litter";
import { Cake, Dna, HandHeart, Heart, PiggyBank, X } from "lucide-react";
import DialogComponent from "../DialogComponent";
import BoarDetailsCard from "../Boar/DetailsCard";

interface SowDetailsCardProps {
  sow: Sow;
  sowBreeds: any[];
  breedings: Breeding[];
  litters: Litter[];
  averagePigletsBornCount: number;
  averageWeightChart: number;
}

export default function SowDetailsCard({
  sow,
  sowBreeds,
  breedings,
  litters,
  averagePigletsBornCount,
  averageWeightChart,
}: SowDetailsCardProps) {
  const validBreedingsCount = breedings.filter(
    (breeding) =>
      breeding.actual_farrow_date &&
      breeding.piglets_born_count !== null &&
      !breeding.is_aborted
  ).length;

  const validLittersCount = litters.filter(
    (litter) => litter.avg_weight && litter.avg_weight > 0
  ).length;

  return (
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
              <span>ไม่อยู่</span>
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
            )}
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
                <DialogComponent
                  key={breed?.id || index}
                  title={breed.breed}
                  dialogTriggerButton={
                    <div className="flex flex-col gap-4 bg-gray-100 p-3 rounded-lg cursor-pointer">
                      <InfoIcon
                        label="สายพันธุ์"
                        icon={<Dna size={22} />}
                        className="text-muted-foreground !bg-white"
                      >
                        {breed?.breed || "ไม่ระบุ"}
                      </InfoIcon>
                    </div>
                  }
                >
                  <BoarDetailsCard boar={breed} />
                </DialogComponent>
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

          {validBreedingsCount > 1 && (
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
          )}

          {validLittersCount > 1 && (
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
  );
}
