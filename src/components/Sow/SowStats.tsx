import { Heart, PiggyBank } from "lucide-react";
import { SowStats as SowStatsType } from "@/hooks/useSowStats";

interface StatsCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: number;
  iconColor: string;
}

function StatsCard({ icon: Icon, title, value, iconColor }: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-lg p-4">
      <Icon size={24} className={iconColor} />
      <div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-2xl font-bold">
          {value} <span className="text-sm">ตัว</span>
        </div>
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