"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardLoadingSkeleton } from "@/components/Dashboard/LoadingSkeleton";
import { DashboardHeader } from "@/components/Dashboard/Header";
import { PregnantSowsSection } from "@/components/Dashboard/PregnantSowsSection";
import { UpcomingEvents } from "@/components/Dashboard/UpcomingEvents";
import { StatsCard } from "@/components/Sow/SowStats";
import { Heart, PawPrint, PiggyBank } from "lucide-react";

export default function Page() {
  const { breededSows, pregnantSowsCount, pigletsCount, isLoading, error } =
    useDashboardData();

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          icon={Heart}
          title="แม่พันธุ์ตั้งครรภ์"
          value={pregnantSowsCount}
          iconColor="text-pink-500"
        />
        <StatsCard
          icon={PiggyBank}
          title="ลูกสุกรขุน"
          value={pigletsCount}
          iconColor="text-pink-500"
        />
      </div>
      <UpcomingEvents />
      <PregnantSowsSection sows={breededSows} />
    </div>
  );
}
