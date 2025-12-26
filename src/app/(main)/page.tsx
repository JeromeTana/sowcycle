"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardLoadingSkeleton } from "@/components/Dashboard/LoadingSkeleton";
import { DashboardHeader } from "@/components/Dashboard/Header";
import { PregnantSowsSection } from "@/components/Dashboard/PregnantSowsSection";
import { UpcomingEvents } from "@/components/Dashboard/UpcomingEvents";
import TopBar from "@/components/TopBar";
import { StatsGrid } from "@/components/Dashboard/StatsGrid";
import { FadeIn } from "@/components/animations/FadeIn";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const {
    breededSows,
    pregnantSowsCount,
    pigletsCount,
    avgWeight,
    avgPigletsBorn,
    weightTrend,
    pigletsTrend,
    breedingTrend,
    pigletsCountTrend,
    isLoading,
    error,
  } = useDashboardData();

  const showToast = () => {
    toast({
      title: "This is a toast notification",
      description: "Hello! This is a sample toast message.",
    });
  }

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
      {/* toast button */}
      <button onClick={showToast}>Toast</button>
      <div className="space-y-8">
        <StatsGrid
          pregnantSowsCount={pregnantSowsCount}
          pigletsCount={pigletsCount}
          avgWeight={avgWeight}
          avgPigletsBorn={avgPigletsBorn}
          weightTrend={weightTrend}
          pigletsTrend={pigletsTrend}
          breedingTrend={breedingTrend}
          pigletsCountTrend={pigletsCountTrend}
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
