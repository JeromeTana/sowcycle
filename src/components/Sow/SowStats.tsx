import { Heart, PiggyBank } from "lucide-react";
import { SowStats as SowStatsType } from "@/hooks/useSowStats";

interface StatsCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: number;
  iconColor: string;
}

export function StatsCard({
  icon: Icon,
  title,
  value,
  iconColor,
}: StatsCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-xl p-4">
      <div className="flex justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="p-2 bg-gray-100 rounded-full">
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="text-2xl font-bold">
        {value} <span className="text-sm">ตัว</span>
      </div>
    </div>
  );
}

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
        iconColor="text-pink-500"
      />
    </div>
  );
}
