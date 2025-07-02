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
import { useMemo } from "react";

interface ExtendedLitter extends Litter {
  sow: Sow | undefined;
}

interface LitterCardProps {
  litter: ExtendedLitter;
  index: number;
}

// Helper component for piglet count badges
const PigletCountBadges = ({
  male,
  female,
}: {
  male: number;
  female: number;
}) => (
  <span className="ml-2 space-x-1">
    <span className="bg-blue-500 font-bold text-white rounded-full px-3 py-1 text-xs">
      ผู้ {male}
    </span>
    <span className="bg-pink-500 font-bold text-white rounded-full px-3 py-1 text-xs">
      เมีย {female}
    </span>
  </span>
);

// Helper component for breed display
const BreedBadges = ({ breeds }: { breeds: string[] }) => (
  <span className="flex gap-1 flex-wrap">
    {breeds.map((breed: string, i: number) => (
      <span
        key={i}
        className="flex items-center gap-1 px-2 py-0.5 border bg-white rounded-full text-xs text-muted-foreground"
      >
        <Dna size={12} />
        <span>{breed}</span>
      </span>
    ))}
  </span>
);

// Helper component for status indicator
const StatusIndicator = ({ litter }: { litter: ExtendedLitter }) => {
  if (litter.sold_at) {
    return <span className="text-green-700">ขายแล้ว · </span>;
  }
  if (litter.fattening_at && !litter.sold_at) {
    return <span className="text-orange-500">กำลังขุน · </span>;
  }
  return null;
};

// Helper component for timeline connector
const TimelineConnector = ({ type }: { type: "solid" | "dashed" }) => (
  <div
    className={cn(
      "w-[0px] border-l-2 border-gray-300 -z-0 h-7 absolute top-10 left-5 -translate-x-1/2",
      type === "dashed" && "border-dashed"
    )}
  />
);

// Helper component for sow information
const SowInfo = ({ sow }: { sow: Sow | undefined }) => (
  <Link href={`/sows/${sow?.id}`} className="rounded-lg p-3 bg-gray-100">
    <InfoIcon
      icon={<PiggyBank size={22} />}
      label="แม่พันธุ์"
      className="!bg-white"
    >
      {sow?.name ? (
        <span className="flex flex-col gap-2">
          {sow.name}
          {sow.breeds && <BreedBadges breeds={sow.breeds} />}
        </span>
      ) : (
        "ไม่ระบุ"
      )}
    </InfoIcon>
  </Link>
);

// Helper component for boar information
const BoarInfo = ({ boars }: { boars: any }) => (
  <Link
    href={`/boars/${boars?.id || ""}`}
    className="rounded-lg p-3 bg-gray-100"
  >
    <InfoIcon icon={<Dna size={22} />} label="พ่อพันธุ์" className="!bg-white">
      {boars.breed}
    </InfoIcon>
  </Link>
);

// Main timeline component
const LitterTimeline = ({ litter }: { litter: ExtendedLitter }) => {
  const showFatteningConnector = litter.fattening_at;
  const showSaleConnector = litter.fattening_at && !litter.sold_at;
  const showSoldConnector = litter.sold_at;

  return (
    <div className="flex flex-col gap-6">
      {/* Birth Date */}
      <div className="relative">
        <InfoIcon
          icon={<Cake size={22} />}
          label="คลอดเมื่อ"
          className="bg-white"
        >
          {formatDate(litter.birth_date!)}
        </InfoIcon>
        {showFatteningConnector && <TimelineConnector type="solid" />}
      </div>

      {/* Fattening Date */}
      {litter.fattening_at && (
        <div className="relative">
          <InfoIcon
            icon={<Beef size={22} />}
            label="เข้าคอกขุนเมื่อ"
            className="bg-white"
          >
            {formatDate(litter.fattening_at)}
          </InfoIcon>
          {showSaleConnector && <TimelineConnector type="dashed" />}
          {showSoldConnector && <TimelineConnector type="solid" />}
        </div>
      )}

      {/* Sale Information */}
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
    </div>
  );
};

export default function LitterCard({ litter, index }: LitterCardProps) {
  // Calculate age once and memoize
  const ageInDays = useMemo(() => {
    const endDate = litter.sold_at ? new Date(litter.sold_at) : new Date();
    const birthDate = new Date(litter.birth_date!);
    return Math.floor(
      (endDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [litter.birth_date, litter.sold_at]);

  if (!litter) return null;

  return (
    <Card key={litter.id} className={cn(litter.sold_at && "opacity-70")}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex gap-2">
              <Fence />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">ครอกที่ {index}</h3>
                <p className="text-sm">
                  <StatusIndicator litter={litter} />
                  <span className="text-muted-foreground">
                    อายุ {ageInDays} วัน
                  </span>
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InfoIcon icon={<PiggyBank size={22} />} label="จำนวน">
                {litter.piglets_born_count} ตัว
                <PigletCountBadges
                  male={litter.piglets_male_born_alive || 0}
                  female={litter.piglets_female_born_alive || 0}
                />
              </InfoIcon>

              {litter.avg_weight && (
                <InfoIcon icon={<Gauge size={22} />} label="น้ำหนักเฉลี่ย">
                  {litter.avg_weight.toFixed(2)} กิโลกรัม
                </InfoIcon>
              )}
            </div>

            {/* Parent Information */}
            <div className="flex flex-col gap-4 text-muted-foreground">
              <SowInfo sow={litter.sow} />

              {litter.boars && <BoarInfo boars={litter.boars} />}

              {litter.boars?.name && (
                <Badge variant="outline">พ่อหมู: {litter.boars.breed}</Badge>
              )}
            </div>

            {/* Timeline */}
            <LitterTimeline litter={litter} />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full flex justify-end gap-2">
          <DialogComponent
            title={`แก้ไขข้อมูลครอกที่ ${index}`}
            dialogTriggerButton={
              <Button variant="ghost">
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
