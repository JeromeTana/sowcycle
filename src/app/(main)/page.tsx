"use client";

import SowList from "@/components/Sow/List";
import { useEffect, useMemo, useState } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { useBoarStore } from "@/stores/useBoarStore";
import { getAllSowsWithLatestBreeding } from "@/services/sow";
import { getAllBoars } from "@/services/boar";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { PREGNANCY_DURATION } from "@/lib/constant";

export default function Page() {
  const { sows, setSows } = useSowStore();
  const { boars, setBoars } = useBoarStore();
  const [isLoading, setIsLoading] = useState(true);

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalSows = sows.length;
    const totalBoars = boars.length;
    const availableSows = sows.filter((sow) => sow.is_available).length;
    const pregnantSows = sows.filter(
      (sow) => !sow.is_available && sow.breedings?.length > 0
    ).length;
    const activeSows = sows.filter((sow) => sow.is_active).length;
    const activeBoars = boars.filter((boar) => boar.is_active).length;

    return {
      totalSows,
      totalBoars,
      availableSows,
      pregnantSows,
      activeSows,
      activeBoars,
    };
  }, [sows, boars]);

  const breededSows = useMemo(() => {
    return sows
      .filter((sow) => !sow.is_available && sow.breedings?.length > 0)
      .sort((a, b) => {
        const aDate = a.breedings[0]?.breed_date
          ? new Date(a.breedings[0].breed_date)
          : new Date(0);
        const bDate = b.breedings[0]?.breed_date
          ? new Date(b.breedings[0].breed_date)
          : new Date(0);
        return aDate.getTime() - bDate.getTime();
      });
  }, [sows]);

  // Calculate sows due soon (within next 30 days)
  const sowsDueSoon = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    return breededSows.filter((sow) => {
      if (!sow.breedings[0]?.breed_date) return false;
      const breedDate = new Date(sow.breedings[0].breed_date);
      const dueDate = new Date(
        breedDate.getTime() + PREGNANCY_DURATION * 24 * 60 * 60 * 1000
      ); // 114 days gestation
      return dueDate <= thirtyDaysFromNow && dueDate >= today;
    });
  }, [breededSows]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sowsData, boarsData] = await Promise.all([
          getAllSowsWithLatestBreeding(),
          getAllBoars(),
        ]);

        if (sowsData) setSows(sowsData);
        if (boarsData) setBoars(boarsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sows.length === 0 || boars.length === 0) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="w-64 h-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">ยินดีต้อนรับ</h1>
        <p className="text-muted-foreground">
          ภาพรวมฟาร์มสุกรของคุณ -{" "}
          {new Date().toLocaleDateString("th-TH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              แม่พันธุ์ทั้งหมด
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalSows}</div>
            <p className="text-xs text-muted-foreground">
              พร้อมผสม {dashboardStats.availableSows} ตัว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              พ่อพันธุ์ทั้งหมด
            </CardTitle>
            <Dna className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalBoars}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">แม่พันธุ์ตั้งครรภ์</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.pregnantSows}
            </div>
            <p className="text-xs text-muted-foreground">
              คิดเป็น{" "}
              {dashboardStats.totalSows > 0
                ? Math.round(
                    (dashboardStats.pregnantSows / dashboardStats.totalSows) *
                      100
                  )
                : 0}
              % ของทั้งหมด
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ใกล้คลอด (30 วัน)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {sowsDueSoon.length}
            </div>
            <p className="text-xs text-muted-foreground">ต้องเตรียมความพร้อม</p>
          </CardContent>
        </Card> */}

      {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              แม่พันธุ์พร้อมผสม
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardStats.availableSows}
            </div>
            <p className="text-xs text-muted-foreground">
              พร้อมสำหรับการผสมพันธุ์
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อัตราการท้อง</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalSows > 0
                ? Math.round(
                    (dashboardStats.pregnantSows / dashboardStats.totalSows) *
                      100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              ประสิทธิภาพการผสมพันธุ์
            </p>
          </CardContent>
        </Card> */}
      {/* </div> */}

      {/* Pregnant Sows Section */}
      {breededSows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <h2 className="text-xl font-semibold">
              แม่พันธุ์ตั้งครรภ์ ({breededSows.length})
            </h2>
          </div>
          <SowList sows={breededSows} />
        </div>
      )}
    </div>
  );
}
