"use client";

import SowList from "@/components/Sow/List";
import { useEffect, useMemo, useState } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { useBoarStore } from "@/stores/useBoarStore";
import { getAllSowsWithLatestBreeding } from "@/services/sow";
import { getAllBoars } from "@/services/boar";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

export default function Page() {
  const { sows, setSows } = useSowStore();
  const { boars, setBoars } = useBoarStore();
  const [isLoading, setIsLoading] = useState(true);

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
