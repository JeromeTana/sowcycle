"use client";

import { useEffect } from "react";
import { useSowOperations } from "@/hooks/useSowOperations";
import { useSowFilters, FILTER_OPTIONS } from "@/hooks/useSowFilters";
import { SowPageHeader } from "@/components/Sow/SowPageHeader";
import SowList from "@/components/Sow/List";
import { LoadingListSkeleton } from "@/components/Sow/LoadingSkeleton";
import TopBar from "@/components/TopBar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const PREGNANT_FILTER = FILTER_OPTIONS.find(
  (option) => option.label === "ตั้งครรภ์"
);

export default function PregnantSowsPage() {
  const { sows, isLoading, error } = useSowOperations({
    includeBreeding: true,
  });

  const { search, setSearch, setFilter, filteredSows } = useSowFilters(sows);

  useEffect(() => {
    if (PREGNANT_FILTER) {
      setFilter(PREGNANT_FILTER);
    }
  }, [setFilter]);

  if (isLoading) {
    return <LoadingListSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        เกิดข้อผิดพลาด: {error}
      </div>
    );
  }

  return (
    <>
      <TopBar title="แม่พันธุ์ตั้งครรภ์" />
      <main className="space-y-4 p-4 pt-0 md:pb-8 md:p-8">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={Search}
          placeholder="ค้นหาด้วยชื่อแม่พันธุ์"
          className="bg-white rounded-full"
        />
        <SowList sows={filteredSows} />
      </main>
    </>
  );
}
