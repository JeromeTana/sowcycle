import { Heart, PiggyBank } from "lucide-react";
import { SowStats as SowStatsType } from "@/hooks/useSowStats";
import { StatsCard } from "@/components/StatsCard";

export { StatsCard };

interface SowStatsProps {
  stats: SowStatsType;
}

export function SowStats({ stats }: SowStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatsCard
        icon={PiggyBank}
        title="จำนวนทั้งหมด"
        value={stats.total}
        iconColor="text-blue-500"
      />
      <StatsCard
        icon={Heart}
        title="กำลังตั้งครรภ์"
        value={stats.pregnant}
        iconColor="text-primary"
      />
    </div>
  );
}
