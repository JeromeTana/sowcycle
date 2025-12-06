"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardLoadingSkeleton } from "@/components/Dashboard/LoadingSkeleton";
import { DashboardHeader } from "@/components/Dashboard/Header";
import { PregnantSowsSection } from "@/components/Dashboard/PregnantSowsSection";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function Page() {
  const { breededSows, isLoading, error } = useDashboardData();

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
        <div className="col-span-2 flex items-center gap-4 bg-white rounded-xl p-4">
          {/*<Icon size={24} className={iconColor} />*/}
          <div>
            <div className="text-sm text-gray-600">เทส</div>
            <div className="text-2xl font-bold">
              2 <span className="text-sm">ตัว</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-xl p-4">
          {/*<Icon size={24} className={iconColor} />*/}
          <div>
            <div className="text-sm text-gray-600">เทส</div>
            <div className="text-2xl font-bold">
              2 <span className="text-sm">ตัว</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-xl p-4">
          {/*<Icon size={24} className={iconColor} />*/}
          <div>
            <div className="text-sm text-gray-600">เทส</div>
            <div className="text-2xl font-bold">
              2 <span className="text-sm">ตัว</span>
            </div>
          </div>
        </div>
      </div>
      <PregnantSowsSection sows={breededSows} />
    </div>
  );
}
