"use client";

import { useSowOperations } from "@/hooks/useSowOperations";
import { useSowFilters } from "@/hooks/useSowFilters";
import { useSowStats } from "@/hooks/useSowStats";
import { SowPageHeader } from "@/components/Sow/SowPageHeader";
import { SowStats } from "@/components/Sow/SowStats";
import { SowFilters } from "@/components/Sow/SowFilters";
import SowList from "@/components/Sow/List";
import { LoadingListSkeleton } from "@/components/Sow/LoadingSkeleton";
import TopBar from "@/components/TopBar";

export default function SowPage() {
  const { sows, isLoading, error } = useSowOperations({
    includeBreeding: true,
  });

  const { search, setSearch, filter, setFilter, filteredSows } =
    useSowFilters(sows);

  const stats = useSowStats(sows);

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
      <TopBar title="แม่พันธุ์" />
      <SowPageHeader />
      <div className="mb-20 space-y-4">
        {/* <SowStats stats={stats} /> */}
        <SowFilters
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
        <SowList sows={filteredSows} />
      </div>
    </>
  );
}
