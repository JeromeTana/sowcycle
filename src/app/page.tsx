"use client";

import SowList from "@/components/Sow/List";
import { useEffect, useMemo, useState } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { getAllSowsWithLatestBreeding } from "@/services/sow";

import { Skeleton } from "@/components/ui/skeleton";
export default function Page() {
  const { sows, setSows } = useSowStore();
  const [isLoading, setIsLoading] = useState(true);

  const breededSows = sows
    .filter((sow) => !sow.is_available)
    .sort((a, b) => {
      return (
        new Date(a.breedings[0].breed_date).getTime() -
        new Date(b.breedings[0].breed_date).getTime()
      );
    });

  useEffect(() => {
    const fetchData = async () => {
      const sows = await getAllSowsWithLatestBreeding();
      if (!sows) return;
      setSows(sows);
      setIsLoading(false);
    };
    sows.length === 0 ? fetchData() : setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="w-48 h-8" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div>
      {breededSows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl">แม่พันธุ์ใกล้คลอด ({breededSows.length})</h2>
          <SowList sows={breededSows} />
        </div>
      )}
    </div>
  );
}
