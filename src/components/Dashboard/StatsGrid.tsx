import { StatsCard } from "@/components/StatsCard";
import { FadeIn } from "@/components/animations/FadeIn";
import { Heart, PiggyBank, Gauge, Baby } from "lucide-react";
import Link from "next/link";

interface StatsGridProps {
  pregnantSowsCount: number;
  pigletsCount: number;
  avgWeight: number;
  avgPigletsBorn: number;
  weightTrend: { value: number }[];
  pigletsTrend: { value: number }[];
  breedingTrend: { value: number }[];
  pigletsCountTrend: { value: number }[];
}

export function StatsGrid({
  pregnantSowsCount,
  pigletsCount,
  avgWeight,
  avgPigletsBorn,
  weightTrend,
  pigletsTrend,
  breedingTrend,
  pigletsCountTrend,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <FadeIn delay={0.1} className="col-span-2">
        <Link href="/sows">
          <StatsCard
            icon={Heart}
            title="แม่พันธุ์ตั้งครรภ์"
            value={pregnantSowsCount}
            iconColor="text-primary"
            trendData={breedingTrend}
            trendColor="#ec4899"
          />
        </Link>
      </FadeIn>
      <FadeIn delay={0.2} className="col-span-2">
        <Link href="/litters">
          <StatsCard
            icon={PiggyBank}
            title="ลูกสุกรขุน"
            value={pigletsCount}
            iconColor="text-blue-500"
            trendData={pigletsCountTrend}
            trendColor="#3b82f6"
          />
        </Link>
      </FadeIn>
      <FadeIn delay={0.3}>
        <Link href="/litters">
          <StatsCard
            icon={Gauge}
            title="น้ำหนักขายเฉลี่ย"
            value={avgWeight}
            unit="กก."
            iconColor="text-purple-500"
            trendData={weightTrend}
            trendColor="#a855f7"
            variant="vertical"
          />
        </Link>
      </FadeIn>
      <FadeIn delay={0.4}>
        <Link href="/litters">
          <StatsCard
            icon={Baby}
            title="ลูกเกิดเฉลี่ย"
            value={avgPigletsBorn}
            unit="ตัว"
            iconColor="text-green-500"
            trendData={pigletsTrend}
            trendColor="#22c55e"
            variant="vertical"
          />
        </Link>
      </FadeIn>
    </div>
  );
}
