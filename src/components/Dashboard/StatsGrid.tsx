import { StatsCard } from "@/components/StatsCard";
import { FadeIn } from "@/components/animations/FadeIn";
import { Heart, PiggyBank, Gauge, Baby } from "lucide-react";

interface StatsGridProps {
  pregnantSowsCount: number;
  pigletsCount: number;
  avgWeight: number;
  avgPigletsBorn: number;
  weightTrend: { value: number }[];
  pigletsTrend: { value: number }[];
}

export function StatsGrid({
  pregnantSowsCount,
  pigletsCount,
  avgWeight,
  avgPigletsBorn,
  weightTrend,
  pigletsTrend,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <FadeIn delay={0.1}>
        <StatsCard
          icon={Heart}
          title="แม่พันธุ์ตั้งครรภ์"
          value={pregnantSowsCount}
          iconColor="text-primary"
        />
      </FadeIn>
      <FadeIn delay={0.2}>
        <StatsCard
          icon={PiggyBank}
          title="ลูกสุกรขุน"
          value={pigletsCount}
          iconColor="text-orange-500"
        />
      </FadeIn>
      <FadeIn delay={0.3} className="col-span-2">
        <StatsCard
          icon={Gauge}
          title="น้ำหนักขายเฉลี่ย"
          value={avgWeight}
          unit="กก."
          iconColor="text-blue-500"
          trendData={weightTrend}
          trendColor="#3b82f6"
        />
      </FadeIn>
      <FadeIn delay={0.4} className="col-span-2">
        <StatsCard
          icon={Baby}
          title="จำนวนลูกเกิดเฉลี่ย"
          value={avgPigletsBorn}
          unit="ตัว/ครอก"
          iconColor="text-green-500"
          trendData={pigletsTrend}
          trendColor="#22c55e"
        />
      </FadeIn>
    </div>
  );
}
