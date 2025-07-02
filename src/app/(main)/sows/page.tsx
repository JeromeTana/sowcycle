"use client";

import { useSowOperations } from "@/hooks/useSowOperations";
import { useSowFilters } from "@/hooks/useSowFilters";
import { useSowStats } from "@/hooks/useSowStats";
import { SowPageHeader } from "@/components/Sow/SowPageHeader";
import { SowStats } from "@/components/Sow/SowStats";
import { SowFilters } from "@/components/Sow/SowFilters";
import SowList from "@/components/Sow/List";
import { LoadingSkeleton } from "@/components/Sow/LoadingSkeleton";

export default function SowPage() {
  const { sows, isLoading, error } = useSowOperations({
    includeBreeding: true,
  });

  const { search, setSearch, filter, setFilter, filteredSows } =
    useSowFilters(sows);

  const stats = useSowStats(sows);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        เกิดข้อผิดพลาด: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      <SowPageHeader />
      <SowStats stats={stats} />
      <SowFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />
      <SowList sows={filteredSows} />
    </div>
  );
}
