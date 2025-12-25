"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardLoadingSkeleton } from "@/components/Dashboard/LoadingSkeleton";
import { DashboardHeader } from "@/components/Dashboard/Header";
import { PregnantSowsSection } from "@/components/Dashboard/PregnantSowsSection";
import { UpcomingEvents } from "@/components/Dashboard/UpcomingEvents";
import TopBar from "@/components/TopBar";
import { StatsGrid } from "@/components/Dashboard/StatsGrid";
import { FadeIn } from "@/components/animations/FadeIn";

export default function Page() {
  const {
    breededSows,
    pregnantSowsCount,
    pigletsCount,
    avgWeight,
    avgPigletsBorn,
    weightTrend,
    pigletsTrend,
    isLoading,
    error,
  } = useDashboardData();

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
    <>
      <TopBar title="หน้าหลัก" />
      <div className="space-y-8">
        <StatsGrid
          pregnantSowsCount={pregnantSowsCount}
          pigletsCount={pigletsCount}
          avgWeight={avgWeight}
          avgPigletsBorn={avgPigletsBorn}
          weightTrend={weightTrend}
          pigletsTrend={pigletsTrend}
        />
        <FadeIn delay={0.5}>
          <UpcomingEvents />
        </FadeIn>
        {/* <FadeIn delay={0.6}>
          <PregnantSowsSection sows={breededSows} />
        </FadeIn> */}
      </div>
    </>
  );
}
